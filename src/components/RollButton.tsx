import Link from "next/link";
import type { ReactNode } from "react";

type RollButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "forest" | "copper" | "white" | "ink" | "ghost" | "ghost-light";
  block?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function RollButton({
  href,
  children,
  variant = "forest",
  block,
  className = "",
  style,
}: RollButtonProps) {
  const cls = ["btn", `btn--${variant}`, block ? "btn--block" : "", className].filter(Boolean).join(" ");
  return (
    <Link className={cls} href={href} style={style}>
      <span className="btn__roll">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </Link>
  );
}
