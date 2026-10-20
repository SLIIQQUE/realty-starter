export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Is this a real brokerage?",
    a: "No. This is a concept marketing site built by SLIIQQUE Studio to demonstrate real-estate web design and engineering for the Canadian realtor vertical. SLIIQQUE does not hold a real-estate licence, \"Priya Mehta\" and \"SLIIQQUE Brokerage\" are fictional, and the properties shown are sample listings for demonstration, not real inventory regulated by RECO.",
  },
  {
    q: "What price range does the concept represent?",
    a: "The sample portfolio is framed around $1.8M–$6.5M CAD Toronto and GTA homes, a deliberate spread from a renovated Leslieville semi to a Rosedale estate, chosen to show real GTA price points across more than one segment rather than a single price tier.",
  },
  {
    q: "Can SLIIQQUE build this for a real buyer's and seller's side?",
    a: "Yes. The concept covers both: buyer tools like search, filtering, a map view, favourites, and a mortgage calculator, plus seller-facing elements like a home valuation request flow and private/off-market framing.",
  },
  {
    q: "How do the search and filter tools work?",
    a: "Entirely client-side, against the sample property data: filter by status, neighbourhood, and minimum bedrooms, or search by keyword. On a real deployment, this same filtering pattern would run against a live MLS®/TRREB feed instead of static sample data.",
  },
  {
    q: "Do I need an account to save or compare properties?",
    a: "No. Favourites and comparisons are stored in your browser's local storage, not a server. Clearing your browser data clears them too.",
  },
  {
    q: "Does the contact form actually send an email?",
    a: "Yes, once a Resend API key is configured for the deployment. Without one, the form returns a clear \"not configured\" message instead of silently failing or pretending to succeed.",
  },
  {
    q: "What areas does the concept portfolio cover?",
    a: "Six Toronto and GTA neighbourhoods: Yorkville, The Beaches, Leslieville, Forest Hill, Liberty Village, and Rosedale, each with its own neighbourhood page.",
  },
  {
    q: "Why build a home valuation form without an instant number?",
    a: "Automated valuation models can be badly wrong on unique, renovated, or character homes, and Toronto's market can shift quickly by neighbourhood. This concept routes valuation requests to a human-review step on purpose, rather than faking a precise number it has no data to back up.",
  },
  {
    q: "Can I reuse this concept for a different kind of business?",
    a: "The underlying pattern (search and filtering, saved items, comparison, calculators, and lead-capture forms that actually send email) applies well beyond real estate. Reach out to talk through what that would look like for your business.",
  },
];

export type BlogPost = {
  slug: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  heroImg?: string;
};

export const POSTS: BlogPost[] = [
  {
    slug: "leslieville-or-liberty-village-freehold-vs-condo",
    category: "Buying Advice",
    date: "Jul 8, 2026",
    title: "Leslieville or Liberty Village: freehold charm vs. low-maintenance condo living",
    excerpt: "The maintenance, cost, and lifestyle trade-offs buyers weigh before choosing a freehold semi over a condo.",
    body: [
      "Buyers comparing a Leslieville semi to a Liberty Village condo almost always ask the same question early: is the extra maintenance of a freehold worth it? The honest answer depends less on the building and more on how much time and cash a buyer wants tied up in upkeep.",
      "A renovated Victorian semi comes with a laneway, a roof, and a furnace that are entirely the owner's responsibility, along with the land transfer tax and closing costs that scale with a higher purchase price. A loft condominium trades that for a monthly maintenance fee that covers the building envelope, amenities, and often heat and water, in exchange for less space and a board-run reserve fund buyers should always review before closing.",
      "The other factor is lifestyle: a laneway suite or finished basement in a freehold can generate rental income or house a parent, while a condo's amenities (gym, rooftop terrace, concierge) require no maintenance at all. Neither is the \"right\" answer; it is a trade buyers should make deliberately rather than by default.",
    ],
  },
  {
    slug: "what-buyers-notice-first-two-minutes",
    category: "Family Moves",
    date: "Jul 6, 2026",
    title: "What buyers notice within the first two minutes",
    excerpt: "Light, smell, and sound shape a first impression long before square footage or finishes register.",
    body: [
      "Before a buyer processes square footage, floor plan, or finishes, they register three things almost unconsciously: natural light, smell, and ambient sound. Staging and photography can influence all three, but only up to a point.",
      "Light is the easiest to fix and the most commonly mishandled, especially through a Toronto winter when short days mean heavy drapery and dim bulbs read as \"dated\" even in an otherwise updated home. Smell is harder: pets, cooking, and wet boots by the door linger in soft surfaces long after a deep clean looks complete. Sound is the one sellers forget entirely: a home near the Gardiner Expressway or under a streetcar line needs showings scheduled around quiet windows, not convenience.",
    ],
  },
  {
    slug: "families-moving-toward-leslieville-and-the-beaches",
    category: "Waterfront Living",
    date: "Jul 4, 2026",
    title: "Why families are moving toward Leslieville and the Beaches",
    excerpt: "Parks, lake access, and a slower pace keep pulling families east of the downtown core.",
    body: [
      "Leslieville and the Beaches keep showing up on family buyers' shortlists for similar reasons: good elementary schools, parkland and lake access within minutes, and a noticeably slower daily pace than denser parts of downtown Toronto.",
      "Both areas also share a practical advantage: deeper lots and laneway access that accommodate the home offices, finished basements, and backyard space that became non-negotiable for many buyers over the past several years.",
    ],
  },
  {
    slug: "designing-a-home-that-still-feels-calm-after-five-years",
    category: "Family Moves",
    date: "Jul 2, 2026",
    title: "Designing a home that still feels calm after five years",
    excerpt: "The design choices that age well are rarely the ones that photograph best on day one.",
    body: [
      "The finishes that photograph best at move-in are not always the ones that still feel calm five years later. Trend-driven choices (a bold accent wall, a statement light fixture tied to a specific design moment) tend to date faster than buyers expect when they're deciding.",
      "What holds up: durable natural materials, a restrained palette, and storage that's actually sized for how a family lives through a full Canadian year (boots and bins in fall and winter, bikes and patio furniture in summer) rather than how a stager arranged a model unit.",
    ],
  },
  {
    slug: "mls-listings-vs-pocket-listings-gta",
    category: "Market Insight",
    date: "Jun 30, 2026",
    title: "The difference between public and private listings in the GTA",
    excerpt: "Why some of the best homes never show up in a public MLS® search.",
    body: [
      "A public listing is marketed broadly: on the MLS® through TRREB, syndicated to major portals, with open showings. A private or off-market listing is shared selectively, often with a smaller pool of pre-qualified buyers, before or instead of going public, within the bounds of current MLS® listing rules.",
      "Sellers choose private routes for discretion, to test pricing quietly, or because a public listing could attract attention they'd rather avoid. For buyers, it means the best-fit home for a given budget sometimes isn't searchable at all. It's a reason relationships with active agents matter more at the top of the GTA market.",
    ],
  },
  {
    slug: "what-actually-adds-value-before-selling-gta",
    category: "Selling Strategy",
    date: "Jun 29, 2026",
    title: "What actually adds value before selling a Toronto home",
    excerpt: "Not every pre-sale project pays for itself; a few reliably do.",
    body: [
      "In the GTA, a full kitchen remodel rarely returns its cost at sale; buyers in this range often want to design their own. What does reliably help: fresh paint in neutral tones, resolved deferred maintenance (roof, furnace, foundation), and professional landscaping that improves the first photo in the listing, even in the shoulder seasons when curb appeal is harder to fake.",
      "The highest-return project is usually the least glamorous: a pre-listing inspection that surfaces issues early, so they're fixed on the seller's timeline instead of renegotiated during a buyer's condition period. It's also worth budgeting for land transfer tax and legal fees on the next purchase well before an offer is accepted.",
    ],
  },
];

export const postsBySlug = new Map(POSTS.map((p) => [p.slug, p]));
