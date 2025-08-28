export const ITEMS_PER_PAGE = 6

export const DEFAULT_FILTERS = {
  priceRange: [200000, 2000000] as [number, number],
  propertyTypes: [] as string[],
  bedrooms: "any",
  bathrooms: "any",
}

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Largest First", value: "sqft-high" },
  { label: "Smallest First", value: "sqft-low" },
]