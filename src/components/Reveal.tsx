"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, RefObject } from "react";

/** Mirrors main.js's reveal-on-scroll: fades + rises an element the first time it enters the viewport. */
function useRevealObserver(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

type RevealProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Reveal<T extends ElementType = "div">({ as, className = "", children, ...rest }: RevealProps<T>) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  useRevealObserver(ref);
  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

type RevealLinkProps = ComponentPropsWithoutRef<typeof Link> & { className?: string };

export function RevealLink({ className = "", children, ...rest }: RevealLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useRevealObserver(ref as RefObject<HTMLElement | null>);
  return (
    <Link ref={ref} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Link>
  );
}

export { useRevealObserver };
