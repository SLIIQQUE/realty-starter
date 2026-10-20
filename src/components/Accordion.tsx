"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export type AccordionItem = { q: string; a: ReactNode };

/** One item open at a time; mirrors main.js's accordion behaviour. Render inside a
 *  `.acc` container (e.g. `<Reveal as="div" className="acc">`). */
export default function Accordion({
  items,
  defaultOpenIndex = 0,
}: {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={`acc__item${isOpen ? " is-open" : ""}`} key={item.q}>
            <button
              className="acc__q"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <i className="acc__icon" />
            </button>
            <div className="acc__a">
              <div>{item.a}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}
