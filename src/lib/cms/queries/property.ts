export const PROPERTY_QUERY = `*[_type == "property"]{
  _id,
  title,
  description,
  address,
  price,
  bedrooms,
  bathrooms,
  sqft,
  dateAdded,
  type,
  features,
  "imageUrl": images[0].asset->url
}`
