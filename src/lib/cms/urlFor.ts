import imageUrlBuilder from "@sanity/image-url"
import { getSanityClient } from "./sanityClient"

const builder = imageUrlBuilder(getSanityClient())

export function urlFor(source: any) {
  return builder.image(source)
}