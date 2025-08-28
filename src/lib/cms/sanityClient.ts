import { createClient, type SanityClient } from "@sanity/client";

export function getSanityClient(): SanityClient {
  return createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET!,
    apiVersion: "2025-08-28",
    token: process.env.SANITY_PRODUCTION,
    useCdn: false,
  });
}