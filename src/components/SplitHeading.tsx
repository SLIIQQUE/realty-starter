"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { useRevealObserver } from "./Reveal";

/** Splits text nodes into per-word spans on mount (preserving nested <em> etc.), then reveals them
 *  staggered; mirrors main.js's data-split word-stagger effect exactly, operating on the live DOM. */
function useSplitWords(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.split) return;
    el.dataset.split = "done";
    let i = 0;
    const walk = (node: Node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          (n.textContent || "").split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const span = document.createElement("span");
            span.className = "w";
            span.style.setProperty("--i", String(i++));
            span.textContent = part;
            frag.appendChild(span);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          walk(n);
        }
      });
    };
    walk(el);
    el.classList.add("split-words");
  }, [ref]);
}

type SplitHeadingProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export default function SplitHeading<T extends ElementType = "h2">({
  as,
  className = "",
  children,
  ...rest
}: SplitHeadingProps<T>) {
  const Tag = (as || "h2") as ElementType;
  const ref = useRef<HTMLElement>(null);
  useSplitWords(ref);
  useRevealObserver(ref);
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
