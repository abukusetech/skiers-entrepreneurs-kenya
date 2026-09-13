-- SKIERS ENTREPRENEURS KENYA
-- Marketplace role enforcement
--
-- Role rules:
--   buyer        -> post jobs, hire workers
--   worker       -> create freelance services, submit proposals, work jobs
--   business     -> post jobs and organization-owned/business listings; never freelance
--   organization -> post jobs and organization-owned listings; never freelance
--
-- This migration deliberately uses database triggers as a second security layer.
-- The Next.js Server Actions also enforce the same rules, but database-side
-- enforcement protects direct API/database writes too.

begin;

-- Organization listings use the existing services marketplace model.
-- A service can belong to either a business or an organization, or to a worker.
alter table public.services
  add column if not exists organization_id uuid references public.organization_profiles(id) on delete set null;

create index if not exists services_organization_id_idx
  on public.services (organization_id)
  where organization_id is not null;

-- A listing belongs to at most one organization/business.
-- Worker freelance services have neither owner-profile foreign key.
-- Existing rows are expected to follow the same model.
alter table public.services
  drop constraint if exists services_listing_owner_check;

alter table public.services
  add constraint services_listing_owner_check
  check (num_nonnulls(business_id, organization_id) <= 1);

-- Keep legacy role flags consistent with the canonical role_choice field.
update public.profiles
set
  is_buyer = (role_choice in ('buyer', 'business', 'organization')),
  is_seller = (role_choice = 'worker')
where role_choice is not null;

-- ---------------------------------------------------------------------------
-- Shared role lookup
-- ---------------------------------------------------------------------------

create or replace function public.skiers_role_for_user(p_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(role_choice, onboarding_role)
  from public.profiles
  where id = p_user_id
  limit 1;
$$;

revoke all on function public.skiers_role_for_user(uuid) from public;
grant execute on function public.skiers_role_for_user(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- SERVICES / LISTINGS
-- ---------------------------------------------------------------------------

create or replace function public.enforce_skiers_service_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
  actor_id uuid := auth.uid();
  business_owner uuid;
  organization_owner uuid;
begin
  -- Deletes are only allowed for the current owner. Existing application
  -- actions archive listings instead of physically deleting them.
  if tg_op = 'DELETE' then
    if actor_id is not null and actor_id <> old.seller_id then
      raise exception 'You do not own this listing';
    end if;
    return old;
  end if;

  if actor_id is not null and new.seller_id <> actor_id then
    raise exception 'Listing owner does not match the signed-in user';
  end if;

  if tg_op = 'UPDATE' and new.seller_id <> old.seller_id then
    raise exception 'Listing ownership cannot be transferred';
  end if;

  actor_role := public.skiers_role_for_user(new.seller_id);

  if actor_role = 'worker' then
    if new.business_id is not null or new.organization_id is not null then
      raise exception 'Worker accounts can only publish freelance services';
    end if;
  elsif actor_role = 'business' then
    if new.business_id is null or new.organization_id is not null then
      raise exception 'Business listings must belong to the business profile';
    end if;

    select owner_id into business_owner
    from public.business_profiles
    where id = new.business_id
      and deleted_at is null;

    if business_owner is distinct from new.seller_id then
      raise exception 'Business listing owner is invalid';
    end if;
  elsif actor_role = 'organization' then
    if new.organization_id is null or new.business_id is not null then
      raise exception 'Organization listings must belong to the organization profile';
    end if;

    select owner_id into organization_owner
    from public.organization_profiles
    where id = new.organization_id
      and deleted_at is null;

    if organization_owner is distinct from new.seller_id then
      raise exception 'Organization listing owner is invalid';
    end if;
  else
    raise exception 'This account type cannot publish marketplace listings';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_skiers_service_role on public.services;
create trigger enforce_skiers_service_role
before insert or update or delete on public.services
for each row execute function public.enforce_skiers_service_role();

-- ---------------------------------------------------------------------------
-- JOBS
-- ---------------------------------------------------------------------------

create or replace function public.enforce_skiers_job_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
  actor_id uuid := auth.uid();
  owner_id uuid;
begin
  if tg_op = 'DELETE' then
    if actor_id is not null and actor_id <> old.buyer_id then
      raise exception 'You do not own this job';
    end if;
    return old;
  end if;

  if actor_id is not null and new.buyer_id <> actor_id then
    raise exception 'Job owner does not match the signed-in user';
  end if;

  if tg_op = 'UPDATE' and new.buyer_id <> old.buyer_id then
    raise exception 'Job ownership cannot be transferred';
  end if;

  actor_role := public.skiers_role_for_user(new.buyer_id);

  if actor_role = 'buyer' then
    if new.business_id is not null or new.organization_id is not null then
      raise exception 'Personal buyer jobs cannot use business or organization ownership';
    end if;
  elsif actor_role = 'business' then
    if new.business_id is null or new.organization_id is not null then
      raise exception 'Business jobs must belong to the business profile';
    end if;
    select owner_id into owner_id from public.business_profiles
    where id = new.business_id and deleted_at is null;
    if owner_id is distinct from new.buyer_id then
      raise exception 'Business job owner is invalid';
    end if;
  elsif actor_role = 'organization' then
    if new.organization_id is null or new.business_id is not null then
      raise exception 'Organization jobs must belong to the organization profile';
    end if;
    select owner_id into owner_id from public.organization_profiles
    where id = new.organization_id and deleted_at is null;
    if owner_id is distinct from new.buyer_id then
      raise exception 'Organization job owner is invalid';
    end if;
  else
    raise exception 'Worker accounts cannot post jobs';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_skiers_job_role on public.jobs;
create trigger enforce_skiers_job_role
before insert or update or delete on public.jobs
for each row execute function public.enforce_skiers_job_role();

-- ---------------------------------------------------------------------------
-- PROPOSALS
-- ---------------------------------------------------------------------------

create or replace function public.enforce_skiers_proposal_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_role text;
begin
  if auth.uid() is not null and new.seller_id <> auth.uid() then
    raise exception 'Proposal owner does not match the signed-in user';
  end if;

  actor_role := public.skiers_role_for_user(new.seller_id);
  if actor_role <> 'worker' then
    raise exception 'Only worker accounts can submit proposals';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_skiers_proposal_role on public.proposals;
create trigger enforce_skiers_proposal_role
before insert or update on public.proposals
for each row execute function public.enforce_skiers_proposal_role();

-- ---------------------------------------------------------------------------
-- JOB ORDERS
-- ---------------------------------------------------------------------------

create or replace function public.enforce_skiers_job_order_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  seller_role text;
begin
  if new.order_type = 'job' then
    seller_role := public.skiers_role_for_user(new.seller_id);
    if seller_role <> 'worker' then
      raise exception 'Business and organization accounts cannot receive freelance job orders';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_skiers_job_order_role on public.orders;
create trigger enforce_skiers_job_order_role
before insert or update on public.orders
for each row execute function public.enforce_skiers_job_order_role();

commit;
