import type { ComponentType, ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
        {children}
      </g>
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 10.5 12 3.5l8.5 7" />
    <path d="M5.5 9.5v10h13v-10" />
    <path d="M9.5 19.5v-5h5v5" />
  </Icon>
);

export const GridIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect height="6.5" rx="1.5" width="6.5" x="3.5" y="3.5" />
    <rect height="6.5" rx="1.5" width="6.5" x="14" y="3.5" />
    <rect height="6.5" rx="1.5" width="6.5" x="3.5" y="14" />
    <rect height="6.5" rx="1.5" width="6.5" x="14" y="14" />
  </Icon>
);

export const PinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s6.5-5.4 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10" r="2.4" />
  </Icon>
);

export const UsersIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19.5c.5-3.3 2.7-5 5.5-5s5 1.7 5.5 5" />
    <path d="M15.5 6.2a3 3 0 0 1 0 5.6" />
    <path d="M17 14.8c2.1.5 3.3 2.1 3.6 4.7" />
  </Icon>
);

export const PenIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m14.8 4.8 4.4 4.4" />
    <path d="M4.5 19.5 5.6 14 16.2 3.4a2 2 0 0 1 2.8 0l1.6 1.6a2 2 0 0 1 0 2.8L10 18.4l-5.5 1.1Z" />
  </Icon>
);

export const FileIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.5 3.5H6.5a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V9Z" />
    <path d="M13.5 3.5V9H19" />
    <path d="M8.5 13h7M8.5 16.5h5" />
  </Icon>
);

export const QuoteIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9.5 6.5H5.5v5h4v6h-4" />
    <path d="M18.5 6.5h-4v5h4v6h-4" />
  </Icon>
);

export const HelpIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.3a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2-2.4 3.7" />
    <path d="M12 17.2h.01" />
  </Icon>
);

export const ImageIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect height="15" rx="2" width="17" x="3.5" y="4.5" />
    <circle cx="8.7" cy="9.6" r="1.5" />
    <path d="m4.5 17 4.8-4.4 3.4 3 2.6-2.2 4.2 3.6" />
  </Icon>
);

export const InboxIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5" />
    <path d="M5.3 5.5h13.4l1.8 8v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-5Z" />
  </Icon>
);

export const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect height="13" rx="2" width="17" x="3.5" y="5.5" />
    <path d="m4.5 7 7.5 5.7L19.5 7" />
  </Icon>
);

export const SlidersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 7h7M15.5 7h4M4.5 17h4M12.5 17h7" />
    <circle cx="13.5" cy="7" r="2" />
    <circle cx="10.5" cy="17" r="2" />
  </Icon>
);

export const RedirectIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8h11.5l-2.5-2.5M20 8l-2.5 2.5" />
    <path d="M20 16H8.5L11 13.5M4 16l2.5-2.5" />
  </Icon>
);

export const PercentIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 18 12-12" />
    <circle cx="7.5" cy="7.5" r="2" />
    <circle cx="16.5" cy="16.5" r="2" />
  </Icon>
);

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5 19 6v5.5c0 4.3-2.8 7.3-7 9-4.2-1.7-7-4.7-7-9V6Z" />
    <path d="M9 12.2 11 14l4-4.2" />
  </Icon>
);

export const TagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 4h7.5L20 12.5 12.5 20 4 11.5Z" />
    <circle cx="8.2" cy="8.2" r="1.3" />
  </Icon>
);

export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M8.5 7H17v8.5" />
  </Icon>
);

export const ArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h15M14 7l5 5-5 5" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 6.5" />
  </Icon>
);

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4 21 20H3Z" />
    <path d="M12 10v4M12 17h.01" />
  </Icon>
);

export const SparkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5c.7 4.6 2.9 6.8 7.5 7.5-4.6.7-6.8 2.9-7.5 7.5-.7-4.6-2.9-6.8-7.5-7.5 4.6-.7 6.8-2.9 7.5-7.5Z" />
    <path d="M19 17.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3Z" />
  </Icon>
);

export const TrendIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m4 16 5-5 3.5 3.5L20 7" />
    <path d="M15 7h5v5" />
  </Icon>
);

export const EyeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.8 12S6 6.5 12 6.5 21.2 12 21.2 12 18 17.5 12 17.5 2.8 12 2.8 12Z" />
    <circle cx="12" cy="12" r="2.6" />
  </Icon>
);

const ICONS: Record<string, ComponentType<IconProps>> = {
  agents: UsersIcon,
  faqs: HelpIcon,
  leads: InboxIcon,
  listings: HomeIcon,
  media: ImageIcon,
  neighbourhoods: PinIcon,
  pages: FileIcon,
  posts: PenIcon,
  redirects: RedirectIcon,
  "site-settings": SlidersIcon,
  "sold-properties": TagIcon,
  subscribers: MailIcon,
  "tax-rules": PercentIcon,
  testimonials: QuoteIcon,
  users: ShieldIcon,
};

export function NavIcon({ slug, size }: { slug: string; size?: number }) {
  const Component = ICONS[slug] ?? GridIcon;
  return <Component size={size} />;
}
