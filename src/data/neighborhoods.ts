import { PROPERTIES } from "./properties";

export type NeighborhoodPage = {
  slug: string;
  name: string;
  region: string;
  heroImg: string;
  blurb: string;
  longDescription: string[];
  stats: [string, string][];
  lat: number;
  lng: number;
};

export const NEIGHBORHOODS: NeighborhoodPage[] = [
  {
    slug: "forest-hill",
    name: "Forest Hill",
    region: "Toronto, Ontario",
    heroImg: "S3LSn60r6cdFpGytCZt4f7AsqFY.jpg",
    blurb:
      "Rolling, ravine-lined streets and some of Toronto's grandest homes, prized for privacy, mature trees, and the city's top-tier private schools.",
    longDescription: [
      "Forest Hill takes its name from the hilly, ravine-carved terrain that sets it apart from the flat street grid surrounding most of midtown Toronto. Annexed into the city in 1967, the area has kept a village-like character, with winding residential streets, mature tree canopy, and a mix of period and architecturally significant homes.",
      "The neighbourhood is closely associated with Upper Canada College and Bishop Strachan School, two of the city's best-known private schools, and with the Kay Gardner Beltline Trail, a former rail corridor now used for walking and cycling that runs along its southern edge toward Moore Park and the Nordheimer and Cedarvale ravines.",
    ],
    stats: [
      ["12 min", "To downtown via St. Clair"],
      ["Line 1", "St. Clair West station"],
      ["Top 1%", "Toronto school zone"],
    ],
    lat: 43.6969,
    lng: -79.4124,
  },
  {
    slug: "rosedale",
    name: "Rosedale",
    region: "Toronto, Ontario",
    heroImg: "qrlJc4vsKUvEXcbKW4lB1A6DZtU.jpg",
    blurb:
      "Toronto's oldest and most established enclave: winding ravine roads, century mansions, and a quiet, closely held market just north of downtown.",
    longDescription: [
      "Developed from the 1850s onward on land originally named for its owner's rose garden, Rosedale is one of Toronto's earliest planned residential communities and remains its most prestigious. Its street pattern breaks from the city's grid, curving instead to follow the ravines that cut through the neighbourhood, which has kept the area unusually quiet and self-contained for its proximity to downtown.",
      "Large Victorian, Edwardian, and Georgian Revival homes sit on generous, often ravine-backed lots, many within walking distance of the Rosedale and Castle Frank subway stations on Line 2. The neighbourhood is also home to Branksome Hall and sits adjacent to the extensive Rosedale Valley ravine trail system.",
    ],
    stats: [
      ["5 min", "To Bloor–Yonge subway"],
      ["Line 2", "Castle Frank station"],
      ["Top 1%", "Toronto school zone"],
    ],
    lat: 43.6796,
    lng: -79.3789,
  },
  {
    slug: "leslieville",
    name: "Leslieville",
    region: "Toronto, Ontario",
    heroImg: "Pj9uv5laqDRjON76kpHxGvMJ5ko.jpg",
    blurb:
      "A once-industrial east-end neighbourhood turned design-forward family enclave, known for converted Victorians, independent cafés, and quick downtown access.",
    longDescription: [
      "Named for market gardener George Leslie, Leslieville grew up around 19th-century brickyards and small factories before becoming one of Toronto's most talked-about east-end turnarounds. Rows of Victorian and Edwardian workers' cottages and semi-detached homes now sell at a premium, many renovated with rear additions and laneway suites.",
      "Queen Street East anchors the neighbourhood's independent cafés, design shops, and restaurants, while the 501 and 503 Queen streetcars and quick access to the Don Valley Parkway keep downtown within a short commute. Leslie Grove Park and nearby Jonathan Ashbridge Park give the area a village feel that continues to draw young families.",
    ],
    stats: [
      ["10 min", "Streetcar to downtown core"],
      ["501/503", "Queen streetcar access"],
      ["Rising", "Family demand"],
    ],
    lat: 43.6629,
    lng: -79.3351,
  },
  {
    slug: "yorkville",
    name: "Yorkville",
    region: "Toronto, Ontario",
    heroImg: "jb7LfoHr7Hn32s97adnDQZFO5o.jpg",
    blurb:
      "Toronto's boutique shopping and gallery district: cobblestone lanes, five-star hotels, and some of the city's most coveted real estate steps from Bloor Street.",
    longDescription: [
      "Once the heart of Toronto's 1960s folk-music and coffeehouse scene, Yorkville has since become the city's premier luxury shopping and gallery district, anchored by the Mink Mile stretch of Bloor Street and cobblestone laneways like Hazelton Avenue and Yorkville Avenue. Four-season boutique hotels, private art galleries, and restored Victorian rowhouses converted to retail and residential use give the neighbourhood a dense, walkable character unlike anywhere else in the city.",
      "A small, tightly held stock of luxury freehold townhomes and low-rise condominiums sits just behind the retail core, within easy walking distance of the Bay and Bloor–Yonge subway stations and the Royal Ontario Museum.",
    ],
    stats: [
      ["8 min", "To the Financial District"],
      ["Line 1", "Bay or Bloor-Yonge station"],
      ["Top-rated", "Downtown school zone"],
    ],
    lat: 43.6709,
    lng: -79.3933,
  },
  {
    slug: "liberty-village",
    name: "Liberty Village",
    region: "Toronto, Ontario",
    heroImg: "XYRf4RZvzWJ9msgmqyhKmKj2Lo.jpg",
    blurb:
      "A former industrial district reborn as a walkable condo and loft community beside Exhibition Place and the waterfront trail.",
    longDescription: [
      "Liberty Village takes its name from the 19th-century Central Prison that once stood nearby: former inmates earning early release were said to gain their 'liberty' in the surrounding streets. The area's brick factories and warehouses, built for companies like Massey-Harris and Inglis, sat largely vacant through the late 20th century before a wave of redevelopment in the 2000s converted them into loft condominiums alongside new mid- and high-rise towers.",
      "The neighbourhood now sits within walking distance of Exhibition Place, BMO Field, and the Martin Goodman waterfront trail, with the 504 King streetcar providing a direct, fast connection into downtown. A dense cluster of cafés, gyms, and patios along King Street West gives the area a young, walkable energy distinct from Toronto's older residential neighbourhoods.",
    ],
    stats: [
      ["6 min", "Streetcar to downtown"],
      ["King St", "504 streetcar access"],
      ["Walkable", "Shops & waterfront trail"],
    ],
    lat: 43.6373,
    lng: -79.4229,
  },
  {
    slug: "the-beaches",
    name: "The Beaches",
    region: "Toronto, Ontario",
    heroImg: "YakBQUTrOeOG0sP4BryPbWMzhUg.jpg",
    blurb:
      "A lakeside village atmosphere with a boardwalk, sandy park, and tree-lined streets, a short streetcar ride from downtown along Queen Street East.",
    longDescription: [
      "The Beaches stretches along Lake Ontario's shoreline east of downtown, centred on a wooden boardwalk that runs from Woodbine Beach past Kew Gardens toward the R.C. Harris Water Treatment Plant. Early-20th-century cottages, many since expanded into full-time family homes, line the quiet streets running up from the water, giving the area a village feel distinct from the rest of the city.",
      "Queen Street East's independent shops and cafés, the annual Beaches International Jazz Festival, and the long sandy park along the water have made the neighbourhood a consistent draw for families who want lake access without leaving the city. The 501 Queen streetcar connects the area to downtown, though the ride is among the longer streetcar commutes in Toronto.",
    ],
    stats: [
      ["25 min", "Streetcar to downtown"],
      ["Lakefront", "Boardwalk & beach access"],
      ["Family-friendly", "Top park system"],
    ],
    lat: 43.6708,
    lng: -79.296,
  },
];

export const neighborhoodsBySlug = new Map(NEIGHBORHOODS.map((n) => [n.slug, n]));

export function propertiesInNeighborhood(name: string) {
  return PROPERTIES.filter((p) => p.hood.name === name);
}
