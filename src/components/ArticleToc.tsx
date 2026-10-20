"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/** Sticky section nav on the About page article; mirrors main.js's TOC scroll-spy. */
export default function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [items]);

  return (
    <aside className="toc">
      <p className="eyebrow">On this page</p>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={active === item.id ? "is-active" : ""}
            onClick={() =>
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
