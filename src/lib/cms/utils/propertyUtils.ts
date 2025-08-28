import type { Property } from "../types"

export const getFilteredListings = (
  properties: Property[],
  filters: {
    priceRange: [number, number]
    propertyTypes: string[]
    bedrooms: string
    bathrooms: string
  },
  searchQuery: string,
  sortBy: string
): Property[] => {
  let results = properties.filter((listing) => {
    const matchesSearch =
      !searchQuery ||
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPrice =
      typeof listing.price === "number" &&
      listing.price >= filters.priceRange[0] &&
      listing.price <= filters.priceRange[1]

    const matchesType =
      filters.propertyTypes.length === 0 ||
      (Array.isArray(listing.type) && listing.type.some((t) => filters.propertyTypes.includes(t)))

    const matchesBedrooms =
      filters.bedrooms === "any" || (listing.bedrooms ?? 0) >= Number(filters.bedrooms)

    const matchesBathrooms =
      filters.bathrooms === "any" || (listing.bathrooms ?? 0) >= Number(filters.bathrooms)

    return matchesSearch && matchesPrice && matchesType && matchesBedrooms && matchesBathrooms
  })

  switch (sortBy) {
    case "price-low":
      results.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
      break
    case "price-high":
      results.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
      break
    case "newest":
      results.sort(
        (a, b) => new Date(b.dateAdded ?? "").getTime() - new Date(a.dateAdded ?? "").getTime()
      )
      break
    case "oldest":
      results.sort(
        (a, b) => new Date(a.dateAdded ?? "").getTime() - new Date(b.dateAdded ?? "").getTime()
      )
      break
    case "sqft-high":
      results.sort((a, b) => (b.sqft ?? 0) - (a.sqft ?? 0))
      break
    case "sqft-low":
      results.sort((a, b) => (a.sqft ?? 0) - (b.sqft ?? 0))
      break
  }

  return results
}