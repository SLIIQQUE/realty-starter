/**
 * Models the CMS "Agents" collection described in the Canada Realtor Vertical build
 * spec (§6). Priya Mehta's facts are pulled from src/data/brand.ts (BRAND.agent) so
 * there is a single source of truth: do not re-enter conflicting details here.
 */
import { BRAND } from "./brand";

export type Agent = {
  slug: string;
  name: string;
  photo: string;
  gallery?: string[];
  title: string;
  bio: string;
  licenceNumber: string;
  regulator: string;
  brokerage: string;
  languages: string[];
  designations: string[];
  /** Kept under `phone` for the Payload schema; the value is the SLIIQQUE WhatsApp number. */
  phone: string;
  email: string;
  socialLinks: { instagram?: string; x?: string; linkedin?: string };
  displayOrder: number;
};

export const AGENTS: Agent[] = [
  {
    slug: "priya-mehta",
    name: BRAND.agent.name,
    photo: "priya-mehta-headshot.jpg",
    // Index 1 (white-blazer) and 3 (condo) are also read directly by about/page.tsx's
    // hero and the home page's "about the agent" section — keep their positions stable.
    gallery: [
      "priya-mehta-green-suit.jpg",
      "priya-mehta-white-blazer.jpg",
      "priya-mehta-yellow-dress.jpg",
      "priya-mehta-condo.jpg",
    ],
    title: BRAND.agent.title,
    bio: "Priya Mehta works with first-time buyers, newcomers, young families, and small investors across the GTA, from condos in Liberty Village to semis in Leslieville. Her approach is warm but straight with the numbers: clear pre-approval guidance, honest answers about what a budget actually buys, and valuations that start with a real conversation instead of an automated guess. This profile is sample content for the SLIIQQUE concept demo.",
    licenceNumber: BRAND.agent.licenceNumber,
    regulator: BRAND.agent.regulatorName,
    brokerage: BRAND.agent.brokerage,
    languages: [...BRAND.agent.languages],
    designations: [...BRAND.agent.designations],
    phone: BRAND.whatsappNumber,
    email: BRAND.email,
    socialLinks: {
      instagram: BRAND.social.instagram,
      x: BRAND.social.x,
    },
    displayOrder: 1,
  },
  {
    slug: "owen-fairweather",
    name: "Owen Fairweather",
    photo: "lLGCOA6MQN8pEj0uwCk4eJ50X3k.jpg",
    title: "Buyer's Agent (demo)",
    bio: "Owen Fairweather supports SLIIQQUE's buyer clients through search, showings, and offer strategy, with a focus on first-time buyers moving into Leslieville and Liberty Village. He is a fictional team member created for this concept demo, shown here to support a future /team page layout.",
    licenceNumber: "DEMO-0000001 (sample, not a real registrant ID)",
    regulator: "Real Estate Council of Ontario (RECO)",
    brokerage: BRAND.agent.brokerage,
    languages: ["English"],
    designations: [],
    phone: BRAND.whatsappNumber,
    email: BRAND.email,
    socialLinks: {},
    displayOrder: 2,
  },
];

export const agentsBySlug = new Map(AGENTS.map((a) => [a.slug, a]));
