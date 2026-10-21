/**
 * Verified SLIIQQUE facts only (COMPANY.md is the source of truth for identity/contact,
 * the Brand Book for voice). This site is a concept/capability demo of SLIIQQUE's Canadian
 * realtor-vertical starter template (see Real-Estate-Website-Build-Spec.md), not an
 * operating real-estate brokerage. SLIIQQUE holds no real-estate license, "Priya Mehta" is
 * fictional, and the listings shown are sample inventory for demonstration, so nothing here
 * should imply a real, licensed business.
 */
export const BRAND = {
  studioName: "SLIIQQUE",
  siteName: "SLIIQQUE",
  tagline: "A concept for discreet, high-trust property marketing, built for the Canadian market.",
  isConceptDemo: true,
  conceptNotice:
    "This is a concept marketing site built by SLIIQQUE Studio to demonstrate real-estate web design and engineering capability for the Canadian realtor vertical. The agent, brokerage, licence number and listings shown are fictional, for demonstration only; SLIIQQUE does not hold a real-estate licence or broker clients directly.",
  email: "hello@sliiqque.space",
  // WhatsApp is the primary contact channel across this site (COMPANY.md is the source of
  // truth for the number). No call or SMS links: most prospects reach SLIIQQUE from another
  // continent, so every contact CTA opens WhatsApp instead.
  whatsappNumber: "+234 704 100 0085",
  whatsappHref: "https://wa.me/2347041000085",
  social: {
    instagram: "https://www.instagram.com/sliiqque",
    x: "https://x.com/sliiqque",
    handle: "@sliiqque",
  },
  hq: "Toronto, Ontario, Canada",
  founded: "22 December 2025",
  founder: "Gabriel Njoabozia",
  parentSiteUrl: "https://sliiqque.space",

  /* ---- Canadian realtor-vertical demo persona (spec §4.3, §5.8, §6 Agents/Site Settings) ---- */
  agent: {
    name: "Priya Mehta",
    title: "Sales Representative",
    brokerage: "SLIIQQUE Brokerage (demo)",
    licenceNumber: "DEMO-0000000 (sample, not a real registrant ID)",
    regulatorName: "Real Estate Council of Ontario (RECO)",
    regulatorUrl: "https://www.reco.on.ca/",
    languages: ["English", "French"],
    designations: ["ABR: Accredited Buyer's Representative (sample)"],
  },
  currency: "CAD",
  province: "Ontario",
  officeAddress: "180 Queens Quay W, Toronto, ON M5J 2X6",
  hours: "Mon–Fri 9am–7pm, Sat 10am–4pm ET. We reply within one business day.",
  trademarkNotice:
    "REALTOR®, REALTORS®, and the REALTOR® logo are certification marks owned by REALTOR® Canada Inc. and licensed to the Canadian Real Estate Association (CREA). MLS®, Multiple Listing Service® and the associated logos are trademarks of CREA, used here only as a demonstration of correct trademark wording; this site is not affiliated with CREA and lists no real MLS® inventory.",
} as const;
