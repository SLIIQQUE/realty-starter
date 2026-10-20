export type Neighbourhood = {
  name: string;
  region: string;
  blurb: string;
  stats: [string, string][];
};

export type OpenHouse = { date: string; time: string };

export type Property = {
  slug: string;
  name: string;
  loc: string;
  lat: number;
  lng: number;
  price: string;
  bed: number;
  bath: number;
  sqft: string;
  feat: string;
  sold: boolean;
  status: "Available" | "New Listing" | "Pending" | "Sold";
  ptype: string;
  year: string;
  lot: string;
  park: string;
  img: string;
  img2: string;
  thumbs: string[];
  about: string[];
  features: string[];
  hood: Neighbourhood;
  openHouses: OpenHouse[];
  tourUrl?: string;
};


export const PROPERTIES: Property[] = [
  {
    slug: "the-dunvegan-house",
    name: "The Dunvegan House",
    loc: "Forest Hill",
    lat: 43.6969,
    lng: -79.4124,
    price: "$5,200,000",
    bed: 5,
    bath: 5,
    sqft: "5,200",
    feat: "Heated Saltwater Pool",
    sold: false,
    status: "Available",
    ptype: "Detached Residence",
    year: "2019",
    lot: "75 x 165 ft ravine lot",
    park: "3-car heated garage",
    img: "frHRZPT1GhZfKBvZhT6LcWHDcc.jpg",
    img2: "AE2P9GEeGwmlVwxJqonHoAlQyY.jpg",
    thumbs: ["9VxiljiB2hC8Adh8h3fMtgINx0c.jpg", "3ql2JLek6qh8cUszTw8z5pN5H5Y.jpg", "WC1TImMHFgv8d4Q4pa7LW6Fnk.jpg"],
    about: [
      "The Dunvegan House sits on a ravine lot above one of Forest Hill's quietest streets, with a mature tree canopy that keeps the home private year-round. The architecture emphasizes clean lines, white oak millwork, and open living spaces designed around natural light.",
      "The main entertaining level connects directly to a stone terrace, a heated saltwater pool, and a lower lawn that backs onto the ravine. Interior finishes include wide-plank white oak floors, honed stone counters, and radiant in-floor heating chosen to keep the home comfortable through a Toronto winter.",
      "Located minutes from the Beltline Trail and a short drive to Upper Canada College and Bishop Strachan School, the property offers the privacy expected of a ravine setting without losing easy access to the rest of midtown Toronto.",
    ],
    features: [
      "Ravine-lot privacy with mature tree canopy",
      "Heated saltwater pool & cabana",
      "Radiant in-floor heating",
      "White oak millwork throughout",
      "Home gym and wine cellar",
      "Smart home and security system",
      "Chef's kitchen with built-in Sub-Zero/Wolf",
      "Steps to the Beltline Trail",
    ],
    hood: {
      name: "Forest Hill",
      region: "Toronto, Ontario",
      blurb:
        "Rolling, ravine-lined streets and some of Toronto's grandest homes, prized for privacy, mature trees, and the city's top-tier private schools.",
      stats: [
        ["12 min", "To downtown via St. Clair"],
        ["Line 1", "St. Clair West station"],
        ["Top 1%", "Toronto school zone"],
      ],
    },
    openHouses: [{ date: "Sat, Nov 8", time: "1:00 PM – 4:00 PM" }],
  },
  {
    slug: "the-castle-frank-residence",
    name: "The Castle Frank Residence",
    loc: "Rosedale",
    lat: 43.6796,
    lng: -79.3789,
    price: "$6,450,000",
    bed: 6,
    bath: 7,
    sqft: "6,200",
    feat: "Private Garden & Pool",
    sold: false,
    status: "New Listing",
    ptype: "Luxury Freehold Estate",
    year: "2022",
    lot: "100 x 200 ft ravine lot",
    park: "4-car garage, circular drive",
    img: "XQOJ0ZhdcmwmwJhEhzUtaWw5p4.jpg",
    img2: "ZXxoCDxg7YFWiT9D1PcnVTWw.jpg",
    thumbs: ["iliNvdiZEyWMPE9IpQ68NPgaeI.jpg", "lTRNfX1qF9KrFvENJImb681b7qA.jpg", "0beK40KYp96zcqeODquQutZbxaQ.jpg"],
    about: [
      "Positioned above the Rosedale ravine, The Castle Frank Residence was designed for buyers who value privacy, proportion, and an Edwardian-inspired exterior built to a contemporary standard. Floor-to-ceiling glass, limestone detailing, and carefully framed ravine views create a home that feels grand without losing warmth.",
      "The main living spaces flow directly toward a landscaped terrace, an in-ground pool, and a rose garden overlooking the ravine trail system. The kitchen, primary suite, and entertaining spaces were designed with both large gatherings and quieter evenings in mind.",
      "Located minutes from the Bloor–Yonge subway interchange and Branksome Hall, the home offers immediate access to downtown while remaining calm and removed from it. Every detail was prepared for effortless, discreet living.",
    ],
    features: [
      "Heated in-ground pool & cabana",
      "Home cinema: 12 seats",
      "Chef's kitchen, Sub-Zero/Wolf appliances",
      "Four-car garage, EV charging",
      "Primary suite with private terrace",
      "Full smart-home automation system",
      "Guest suite: 1 bed / 1 bath",
      "Ravine and skyline views",
    ],
    hood: {
      name: "Rosedale",
      region: "Toronto, Ontario",
      blurb:
        "Toronto's oldest and most established enclave: winding ravine roads, century mansions, and a quiet, closely held market just north of downtown.",
      stats: [
        ["5 min", "To Bloor–Yonge subway"],
        ["Line 2", "Castle Frank station"],
        ["Top 1%", "Toronto school zone"],
      ],
    },
    openHouses: [],
  },
  {
    slug: "the-ashbridge-semi",
    name: "The Ashbridge Semi",
    loc: "Leslieville",
    lat: 43.6629,
    lng: -79.3351,
    price: "$2,150,000",
    bed: 4,
    bath: 3,
    sqft: "2,650",
    feat: "Finished Laneway Suite",
    sold: false,
    status: "Pending",
    ptype: "Renovated Victorian Semi-Detached",
    year: "1911 (renovated 2020)",
    lot: "18 x 120 ft lot",
    park: "Private laneway parking pad",
    img: "PJdZd1adAgWdgdTeDru47g690E.jpg",
    img2: "remQfNeRY5YDXjKii4XwKBS6cHI.jpg",
    thumbs: ["arOA8M7RvS1X2YkOpgxSv4FgGyY.jpg", "lLGCOA6MQN8pEj0uwCk4eJ50X3k.jpg", "T2XNx7bNubLRdhdV0RBBpWdBeFU.jpg"],
    about: [
      "Set on a quiet side street in Leslieville, The Ashbridge Semi combines a restored Victorian exterior with a fully reimagined interior suited for family living. Large rear windows and an open-concept main-floor addition bring natural light into every part of the home.",
      "A finished laneway suite, landscaped backyard deck, and detached parking pad create flexible space for guests, a home office, or rental income. The primary suite opens toward the garden, while additional bedrooms and a finished basement support both family and remote work needs.",
      "The property is currently conditionally sold, reflecting continued demand for move-in-ready Victorians within walking distance of Queen Street East.",
    ],
    features: [
      "Finished laneway suite (rental or in-law potential)",
      "Exposed brick and original wood trim",
      "Open-concept main-floor addition",
      "Chef's kitchen with waterfall island",
      "Primary suite with ensuite bath",
      "Landscaped backyard deck",
      "Steps to Leslie Grove Park",
      "Short walk to Queen St E shops and cafés",
    ],
    hood: {
      name: "Leslieville",
      region: "Toronto, Ontario",
      blurb:
        "A once-industrial east-end neighbourhood turned design-forward family enclave, known for converted Victorians, independent cafés, and quick downtown access.",
      stats: [
        ["10 min", "Streetcar to downtown core"],
        ["501/503", "Queen streetcar access"],
        ["Rising", "Family demand"],
      ],
    },
    openHouses: [],
  },
  {
    slug: "the-hazelton-townhome",
    name: "The Hazelton Townhome",
    loc: "Yorkville",
    lat: 43.6709,
    lng: -79.3933,
    price: "$3,950,000",
    bed: 3,
    bath: 4,
    sqft: "3,100",
    feat: "Rooftop Terrace",
    sold: true,
    status: "Sold",
    ptype: "Luxury Freehold Townhome",
    year: "2017",
    lot: "20 x 80 ft lot",
    park: "2-car garage, laneway access",
    img: "wUNokG3QHHu3pUkyBw1rFdGdfx4.jpg",
    img2: "FkxgeBFkzxrAsfsIgrJnykt15bE.jpg",
    thumbs: ["JbXLsXwWshGcBWwgU63vIPmnE.jpg", "lvWhEaoBNYfjj5r3ldp5PornBQ.jpg", "NAIb8R15tVkoNYEQlQvg0HfzhM.jpg"],
    about: [
      "The Hazelton Townhome sits on a quiet street behind Yorkville's boutique core, near Hazelton Avenue's galleries and five-star hotels. The home combines classic architectural details with updated interiors designed for modern daily living.",
      "The main level includes formal entertaining rooms, a chef's kitchen, and a private rooftop terrace with downtown skyline views. Upstairs, generous bedroom suites provide privacy and flexibility for both full-time living and part-time use.",
      "The property was sold privately after limited qualified showings, allowing both buyer and seller to move carefully and discreetly throughout the process.",
    ],
    features: [
      "Private rooftop terrace with skyline views",
      "Formal dining and entertaining rooms",
      "Chef's kitchen with integrated appliances",
      "Primary suite with dressing room",
      "Home office / media room",
      "Temperature-controlled wine storage",
      "Heated floors throughout",
      "Steps to Yorkville boutiques and galleries",
    ],
    hood: {
      name: "Yorkville",
      region: "Toronto, Ontario",
      blurb:
        "Toronto's boutique shopping and gallery district: cobblestone lanes, five-star hotels, and some of the city's most coveted real estate steps from Bloor Street.",
      stats: [
        ["8 min", "To the Financial District"],
        ["Line 1", "Bay or Bloor-Yonge station"],
        ["Top-rated", "Downtown school zone"],
      ],
    },
    openHouses: [],
  },
  {
    slug: "the-king-street-atelier",
    name: "The King Street Atelier",
    loc: "Liberty Village",
    lat: 43.6373,
    lng: -79.4229,
    price: "$1,895,000",
    bed: 2,
    bath: 2,
    sqft: "1,450",
    feat: "Exposed Brick & Timber Loft",
    sold: true,
    status: "Sold",
    ptype: "Loft Condominium",
    year: "1910 building, converted 2016",
    lot: "N/A (condominium)",
    park: "1 owned underground spot + locker",
    img: "i46xXCsq4vRxnapEm4X5KD0x3PI.jpg",
    img2: "4RthJvhusNI0mXJ0dDYWTpUycvI.jpg",
    thumbs: ["ESjgTyLf7hNb0kroswxNdeIAKY.jpg", "Cqg6vuRs8sAxHpdZEH9DHhIWBwM.jpg", "R5uv0gM85T8CrPiogqnyLbr328.jpg"],
    about: [
      "The King Street Atelier was created for buyers who appreciate architecture, creative space, and proximity to downtown Toronto. Converted from a century-old industrial building, the loft features exposed brick, timber ceiling beams, and oversized factory-style windows.",
      "Soaring ceilings and an open floor plan connect the living area to a private balcony overlooking Liberty Village's low-rise streets. The kitchen and living space were designed with a gallery-like simplicity that keeps the focus on light and original material.",
      "Situated close to King Street West and Exhibition Place, the condominium offers a balance between vibrant city access and the quieter residential pocket Liberty Village has become.",
    ],
    features: [
      "Exposed brick and timber ceiling beams",
      "10-ft-plus ceilings",
      "Chef's kitchen with waterfall island",
      "Primary bedroom with walk-in closet",
      "Private balcony",
      "Owned underground parking and locker",
      "Rooftop terrace and gym in building",
      "Steps to King St West restaurants",
    ],
    hood: {
      name: "Liberty Village",
      region: "Toronto, Ontario",
      blurb:
        "A former industrial district reborn as a walkable condo and loft community beside Exhibition Place and the waterfront trail.",
      stats: [
        ["6 min", "Streetcar to downtown"],
        ["King St", "504 streetcar access"],
        ["Walkable", "Shops & waterfront trail"],
      ],
    },
    openHouses: [],
  },
  {
    slug: "the-kew-beach-house",
    name: "The Kew Beach House",
    loc: "The Beaches",
    lat: 43.6708,
    lng: -79.296,
    price: "$2,650,000",
    bed: 5,
    bath: 4,
    sqft: "3,000",
    feat: "Private Backyard Pool",
    sold: true,
    status: "Sold",
    ptype: "Detached Residence",
    year: "1923 (renovated 2019)",
    lot: "30 x 130 ft lot",
    park: "Private double drive, laneway garage",
    img: "wbAIWmqLId0YDk98LFipkrlKwY.jpg",
    img2: "15teLKO8BumS8q617YP1oylDiU.jpg",
    thumbs: ["mvm63HxcgpDbwVekbZtWe1lskys.jpg", "3ACuk7NUmk9Pqoo3PS1A6o2BaS0.jpg", "cY8qvMo5cNUeBoc8sJlAE1910.jpg"],
    about: [
      "A short walk from the boardwalk, The Kew Beach House was designed to maximize light, openness, and connection to the neighbourhood's village feel. Large windows frame views of mature trees and the quiet, bike-friendly street outside.",
      "A wraparound front porch and private backyard pool create multiple areas for entertaining or spending time privately. Interior materials remain calm and natural, letting the character of the century home lead the experience.",
      "The property combines lakeside-village living with the privacy and renovated comfort buyers increasingly expect from a character home in the Beaches, making it equally suited for a growing family or a quieter next chapter.",
    ],
    features: [
      "Steps to the boardwalk and beach",
      "Private backyard pool",
      "Wraparound front porch",
      "Renovated chef's kitchen",
      "Primary suite with ensuite",
      "Finished basement rec room",
      "Mudroom with built-in storage",
      "Walk to Queen St E shops and cafés",
    ],
    hood: {
      name: "The Beaches",
      region: "Toronto, Ontario",
      blurb:
        "A lakeside village atmosphere with a boardwalk, sandy park, and tree-lined streets, a short streetcar ride from downtown along Queen Street East.",
      stats: [
        ["25 min", "Streetcar to downtown"],
        ["Lakefront", "Boardwalk & beach access"],
        ["Family-friendly", "Top park system"],
      ],
    },
    openHouses: [{ date: "Sun, Nov 9", time: "2:00 PM – 5:00 PM" }],
  },
];

export const propertiesBySlug = new Map(PROPERTIES.map((p) => [p.slug, p]));

export function fmtBath(bath: number): string {
  return Number.isInteger(bath) ? String(bath) : bath.toFixed(1);
}
