import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/utils/cn";

interface SlotProps {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

// Merges its own props onto its single child element.
// Handles refs, classNames, and event handlers (child's own handler runs
// first, then the slot's).
export const Slot = forwardRef<HTMLElement, SlotProps>(
  function Slot(props, forwardedRef) {
    const { children, className, ...slotProps } = props;

    if (!isValidElement(children)) {
      return null;
    }

    const child = children as ReactElement<{
      className?: string;
      ref?: Ref<HTMLElement>;
    }>;

    const childProps = child.props as Record<string, unknown>;

    const mergedClassName = cn(
      typeof className === "string" ? className : undefined,
      typeof childProps.className === "string"
        ? childProps.className
        : undefined,
    );

    const mergedProps: Record<string, unknown> = {
      ...slotProps,
      ...childProps,
      className: mergedClassName,
    };

    // Merge event handlers so the child's handler runs before the slot's.
    for (const key of Object.keys(slotProps)) {
      const slotValue = slotProps[key];
      if (key.startsWith("on") && typeof slotValue === "function") {
        const slotHandler = slotValue as (...args: unknown[]) => void;
        const childHandler = childProps[key];
        if (typeof childHandler === "function") {
          mergedProps[key] = (...args: unknown[]) => {
            (childHandler as (...args: unknown[]) => void)(...args);
            slotHandler(...args);
          };
        }
      }
    }

    // Merge refs so both the slot's forwardedRef and the child's own ref fire.
    const childRef = childProps.ref as Ref<HTMLElement> | undefined;
    if (forwardedRef) {
      mergedProps.ref = (node: HTMLElement | null) => {
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) {
          (forwardedRef as { current: HTMLElement | null }).current = node;
        }
        if (typeof childRef === "function") childRef(node);
        else if (childRef) {
          (childRef as { current: HTMLElement | null }).current = node;
        }
      };
    }

    return cloneElement(child, mergedProps);
  },
);
