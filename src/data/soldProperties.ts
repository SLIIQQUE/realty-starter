/**
 * Models the CMS "Sold Properties" collection described in the Canada Realtor
 * Vertical build spec (§6), a lighter-weight record than src/data/properties.ts,
 * meant for a simple "recent sales" proof-of-activity module rather than a full
 * listing detail page. Sample data only; reuses existing photo assets.
 */
export type SoldProperty = {
  addressArea: string;
  saleMonth: string;
  soldPrice: string;
  propertyType: string;
  photo: string;
  note: string;
};

export const SOLD_PROPERTIES: SoldProperty[] = [
  {
    addressArea: "Hazelton Ave area, Yorkville",
    saleMonth: "September 2026",
    soldPrice: "$3,950,000",
    propertyType: "Luxury Freehold Townhome",
    photo: "wUNokG3QHHu3pUkyBw1rFdGdfx4.jpg",
    note: "Sold privately after limited qualified showings.",
  },
  {
    addressArea: "King St W area, Liberty Village",
    saleMonth: "August 2026",
    soldPrice: "$1,895,000",
    propertyType: "Loft Condominium",
    photo: "i46xXCsq4vRxnapEm4X5KD0x3PI.jpg",
    note: "Multiple-offer sale, closed above list price.",
  },
  {
    addressArea: "Kew Beach area, The Beaches",
    saleMonth: "July 2026",
    soldPrice: "$2,650,000",
    propertyType: "Detached Residence",
    photo: "wbAIWmqLId0YDk98LFipkrlKwY.jpg",
    note: "Renovated century home, sold to a growing family.",
  },
  {
    addressArea: "Jonathan Ashbridge area, Leslieville",
    saleMonth: "June 2026",
    soldPrice: "$2,075,000",
    propertyType: "Victorian Semi-Detached",
    photo: "PJdZd1adAgWdgdTeDru47g690E.jpg",
    note: "Buyer represented by SLIIQQUE.",
  },
  {
    addressArea: "Dunvegan Rd area, Forest Hill",
    saleMonth: "May 2026",
    soldPrice: "$5,075,000",
    propertyType: "Detached Residence",
    photo: "frHRZPT1GhZfKBvZhT6LcWHDcc.jpg",
    note: "Ravine lot, sold within two weeks of listing.",
  },
  {
    addressArea: "Castle Frank area, Rosedale",
    saleMonth: "April 2026",
    soldPrice: "$6,200,000",
    propertyType: "Luxury Freehold Estate",
    photo: "XQOJ0ZhdcmwmwJhEhzUtaWw5p4.jpg",
    note: "Represented the seller through a discreet, off-market process.",
  },
];
