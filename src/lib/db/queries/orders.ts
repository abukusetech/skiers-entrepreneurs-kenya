import { createClient } from "@/lib/supabase/server";

export type OrderListItem = {
  id: string;
  order_number: string;
  order_type: string;
  status: string;
  total_amount: number;
  platform_fee: number;
  seller_amount: number;
  currency: string;
  delivery_time_days: number | null;
  created_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
  buyer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
  seller: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
  service: {
    id: string;
    title: string;
    slug: string;
  } | null;
  job: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

export type OrderDetail = OrderListItem & {
  requirements: string | null;
  buyer_notes: string | null;
  package_type: string | null;
  milestones: {
    id: string;
    title: string;
    description: string | null;
    amount: number;
    status: string;
    due_date: string | null;
    sort_order: number;
    completed_at: string | null;
  }[];
  revisions: {
    id: string;
    revision_details: string | null;
    status: string;
    created_at: string;
    requested_by: {
      id: string;
      full_name: string;
    } | null;
  }[];
  buyer_review: {
    id: string;
    rating_overall: number;
    review_text: string | null;
    created_at: string;
  } | null;
  seller_review: {
    id: string;
    rating_overall: number;
    review_text: string | null;
    created_at: string;
  } | null;
};

const ORDER_FIELDS = `
  id,
  order_number,
  order_type,
  status,
  total_amount,
  platform_fee,
  seller_amount,
  currency,
  delivery_time_days,
  created_at,
  completed_at,
  cancelled_at,
  buyer:profiles!orders_buyer_id_fkey(
    id,
    full_name,
    avatar_url
  ),
  seller:profiles!orders_seller_id_fkey(
    id,
    full_name,
    avatar_url
  ),
  service:services!orders_service_id_fkey(
    id,
    title,
    slug
  ),
  job:jobs!orders_job_id_fkey(
    id,
    title,
    slug
  )
`;

export async function getUserOrders(
  userId: string,
  role: "buyer" | "seller" | "all" = "all",
): Promise<OrderListItem[]> {
  const supabase = await createClient();

  if (role === "buyer") {
    const { data } = await supabase
      .from("orders")
      .select(ORDER_FIELDS)
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false });
    return (data || []) as unknown as OrderListItem[];
  }

  if (role === "seller") {
    const { data } = await supabase
      .from("orders")
      .select(ORDER_FIELDS)
      .eq("seller_id", userId)
      .order("created_at", { ascending: false });
    return (data || []) as unknown as OrderListItem[];
  }

  // role === "all": two separate queries, merged in JS.
  const [buyerRes, sellerRes] = await Promise.all([
    supabase
      .from("orders")
      .select(ORDER_FIELDS)
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select(ORDER_FIELDS)
      .eq("seller_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const buyerOrders = (buyerRes.data || []) as unknown as OrderListItem[];
  const sellerOrders = (sellerRes.data || []) as unknown as OrderListItem[];

  // Deduplicate by id (in case the user is both buyer and seller on the
  // same order, which shouldn't happen but is a safety net).
  const seen = new Set<string>();
  const merged: OrderListItem[] = [];
  for (const order of [...buyerOrders, ...sellerOrders]) {
    if (seen.has(order.id)) continue;
    seen.add(order.id);
    merged.push(order);
  }
  merged.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  return merged;
}

export async function getOrderById(
  orderId: string,
  userId: string,
): Promise<OrderDetail | null> {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      ${ORDER_FIELDS},
      requirements,
      buyer_notes,
      package_type
    `,
    )
    .eq("id", orderId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .maybeSingle();

  if (error || !order) {
    if (error) console.error("Error fetching order:", error.message);
    return null;
  }

  const [milestonesRes, revisionsRes, reviewsRes] = await Promise.all([
    supabase
      .from("order_milestones")
      .select(
        "id, title, description, amount, status, due_date, sort_order, completed_at",
      )
      .eq("order_id", order.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("order_revisions")
      .select(
        `
        id,
        revision_details,
        status,
        created_at,
        requested_by:profiles!order_revisions_requested_by_fkey(
          id,
          full_name
        )
      `,
      )
      .eq("order_id", order.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select(
        "id, reviewer_id, reviewee_id, rating_overall, review_text, created_at",
      )
      .eq("order_id", order.id),
  ]);

  const reviews = reviewsRes.data || [];
  const buyerReview = reviews.find(
    (r: { reviewer_id?: string }) =>
      r.reviewer_id === (order as { buyer_id?: string }).buyer_id,
  );
  const sellerReview = reviews.find(
    (r: { reviewer_id?: string }) =>
      r.reviewer_id === (order as { seller_id?: string }).seller_id,
  );

  return {
    ...(order as unknown as OrderListItem),
    requirements:
      (order as { requirements?: string | null }).requirements ?? null,
    buyer_notes: (order as { buyer_notes?: string | null }).buyer_notes ?? null,
    package_type:
      (order as { package_type?: string | null }).package_type ?? null,
    milestones: milestonesRes.data || [],
    revisions: (revisionsRes.data || []) as unknown as OrderDetail["revisions"],
    buyer_review: buyerReview
      ? {
          id: buyerReview.id,
          rating_overall: buyerReview.rating_overall,
          review_text: buyerReview.review_text,
          created_at: buyerReview.created_at,
        }
      : null,
    seller_review: sellerReview
      ? {
          id: sellerReview.id,
          rating_overall: sellerReview.rating_overall,
          review_text: sellerReview.review_text,
          created_at: sellerReview.created_at,
        }
      : null,
  };
}

export async function getOrderStats(userId: string, role: "buyer" | "seller") {
  const supabase = await createClient();

  const column = role === "buyer" ? "buyer_id" : "seller_id";

  const { data, error } = await supabase
    .from("orders")
    .select("status, total_amount")
    .eq(column, userId);

  if (error) {
    console.error("Error fetching order stats:", error.message);
    return { total: 0, active: 0, completed: 0, totalAmount: 0 };
  }

  const orders = data || [];

  const active = orders.filter(
    (o) =>
      o.status === "created" ||
      o.status === "paid" ||
      o.status === "in_progress" ||
      o.status === "submitted" ||
      o.status === "in_review" ||
      o.status === "revision_requested",
  ).length;

  const completed = orders.filter((o) => o.status === "completed").length;

  const totalAmount = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return { total: orders.length, active, completed, totalAmount };
}
