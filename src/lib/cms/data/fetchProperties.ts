import { getSanityClient } from '../sanityClient.js'

export async function fetchProperties() {
  const client = getSanityClient() // <— call the function to get the client
  const query = `
    *[_type == "property"]{
      title,
      address,
      price,
      bedrooms,
      agent->{
        name,
        phone
      }
    }
  `

  try {
    const properties = await client.fetch(query) // <— use fetch on the client
    return properties
  } catch (error) {
    console.error("Failed to fetch properties:", error)
    throw error
  }
}