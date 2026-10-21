/**
 * Models the CMS "Testimonials" collection described in the Canada Realtor
 * Vertical build spec (§6). Sample quotes for the SLIIQQUE concept
 * demo, permissionRecorded is true throughout because this sample data is
 * presented as if the usual client permission to publish had been obtained,
 * consistent with the concept-demo framing (no real clients exist).
 */
export type Testimonial = {
  name: string;
  role: "buyer" | "seller";
  quote: string;
  source: string;
  date: string;
  photo: string;
  permissionRecorded: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Simran K.",
    role: "buyer",
    quote:
      "Priya walked us through three Leslieville semis in one Saturday and was upfront about which ones had laneway potential and which didn't. We closed within our budget and didn't feel rushed once.",
    source: "Google Reviews",
    date: "August 2026",
    photo: "lvWhEaoBNYfjj5r3ldp5PornBQ.jpg",
    permissionRecorded: true,
  },
  {
    name: "David & Marc T.",
    role: "seller",
    quote:
      "We sold our Forest Hill house off-market through SLIIQQUE and never had a stranger walk through our home. The whole process took under three weeks.",
    source: "Client email",
    date: "May 2026",
    photo: "lLGCOA6MQN8pEj0uwCk4eJ50X3k.jpg",
    permissionRecorded: true,
  },
  {
    name: "Aisha K.",
    role: "buyer",
    quote:
      "First-time buyer here, the land transfer tax calculator and the honest answer about what we could actually afford in Liberty Village saved us from overextending.",
    source: "Google Reviews",
    date: "July 2026",
    photo: "Cqg6vuRs8sAxHpdZEH9DHhIWBwM.jpg",
    permissionRecorded: true,
  },
  {
    name: "Robert F.",
    role: "seller",
    quote:
      "The valuation request didn't come back with a fake instant number. It came back with Priya walking us through comparable Rosedale sales on WhatsApp. That mattered more than I expected.",
    source: "Client email",
    date: "April 2026",
    photo: "arOA8M7RvS1X2YkOpgxSv4FgGyY.jpg",
    permissionRecorded: true,
  },
  {
    name: "Jenna W.",
    role: "buyer",
    quote:
      "We looked at Yorkville for a year on our own before reaching out. Priya found us a townhome that wasn't even public yet.",
    source: "Google Reviews",
    date: "September 2026",
    photo: "JbXLsXwWshGcBWwgU63vIPmnE.jpg",
    permissionRecorded: true,
  },
];
