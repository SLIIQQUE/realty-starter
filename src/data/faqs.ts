/**
 * Models the CMS "FAQs" collection described in the Canada Realtor Vertical
 * build spec (§6), topic-grouped, for a future filterable FAQ page. The
 * underlying content is adapted from src/data/content.ts (FAQS), reorganized
 * by topic rather than written from scratch. This type is named TopicFaq to
 * avoid colliding with content.ts's own `Faq` type.
 */
export type TopicFaq = {
  question: string;
  answer: string;
  topic: "Buying" | "Selling" | "Working with Priya" | "Site & Tools";
  displayOrder: number;
};

export const TOPIC_FAQS: TopicFaq[] = [
  {
    question: "What price range does the concept represent?",
    answer:
      "The sample portfolio is framed around $1.8M–$6.5M CAD Toronto and GTA homes, a deliberate spread from a renovated Leslieville semi to a Rosedale estate, chosen to show real GTA price points across more than one segment, not just a single tier.",
    topic: "Buying",
    displayOrder: 1,
  },
  {
    question: "How do the search and filter tools work?",
    answer:
      "Entirely client-side, against the sample property data: filter by status, neighbourhood, and minimum bedrooms, or search by keyword. On a real deployment, this same filtering pattern would run against a live MLS®/TRREB feed instead of static sample data.",
    topic: "Buying",
    displayOrder: 2,
  },
  {
    question: "Do I need an account to save or compare properties?",
    answer:
      "No. Favourites and comparisons are stored in your browser's local storage, not a server. Clearing your browser data clears them too.",
    topic: "Buying",
    displayOrder: 3,
  },
  {
    question: "Why build a home valuation form without an instant number?",
    answer:
      "Automated valuation models can be badly wrong on unique, renovated, or character homes, and Toronto's market can shift quickly by neighbourhood. This concept routes valuation requests to a human-review step on purpose, rather than faking a precise number it has no data to back up.",
    topic: "Selling",
    displayOrder: 1,
  },
  {
    question: "Can SLIIQQUE build this for a real buyer's and seller's side?",
    answer:
      "Yes. The concept covers both: buyer tools like search, filtering, a map view, favourites, and a mortgage calculator, plus seller-facing elements like a home valuation request flow and private/off-market framing.",
    topic: "Selling",
    displayOrder: 2,
  },
  {
    question: "Is this a real brokerage?",
    answer:
      "No. This is a concept marketing site built by SLIIQQUE Studio to demonstrate real-estate web design and engineering for the Canadian realtor vertical. SLIIQQUE does not hold a real-estate licence, \"Priya Mehta\" and \"SLIIQQUE Brokerage\" are fictional, and the properties shown are sample listings for demonstration, not real inventory regulated by RECO.",
    topic: "Working with Priya",
    displayOrder: 1,
  },
  {
    question: "What areas does Priya cover?",
    answer:
      "Six Toronto and GTA neighbourhoods in this sample portfolio: Yorkville, The Beaches, Leslieville, Forest Hill, Liberty Village, and Rosedale, each with its own neighbourhood page.",
    topic: "Working with Priya",
    displayOrder: 2,
  },
  {
    question: "Does the contact form actually send an email?",
    answer:
      "Yes, once a Resend API key is configured for the deployment. Without one, the form returns a clear \"not configured\" message instead of silently failing or pretending to succeed.",
    topic: "Site & Tools",
    displayOrder: 1,
  },
  {
    question: "Can I reuse this concept for a different kind of business?",
    answer:
      "The underlying pattern (search and filtering, saved items, comparison, calculators, and lead-capture forms that actually send email) applies well beyond real estate. Reach out to talk through what that would look like for your business.",
    topic: "Site & Tools",
    displayOrder: 2,
  },
];
