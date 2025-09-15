import express from "express"
import { getSanityClient } from "../lib/cms/sanityClient.js"
import { SITE_SETTINGS_QUERY } from "../lib/cms/queries/siteSettings.js"
import imageUrlBuilder from "@sanity/image-url"

const router = express.Router()

router.get("/site-settings", async (req, res) => {
  try {
    const client = getSanityClient()
    const data = await client.fetch(SITE_SETTINGS_QUERY)

    const builder = imageUrlBuilder(client)
    const siteSettings = data || null

    const siteSettingsWithUrls = {
      ...siteSettings,
      logoContrastUrl: siteSettings?.logoContrast ? builder.image(siteSettings.logoContrast).url() : null,
      logoPrimaryUrl: siteSettings?.logoPrimary ? builder.image(siteSettings.logoPrimary).url() : null,
      heroImageUrl: siteSettings?.heroImage ? builder.image(siteSettings.heroImage).url() : null,
      faviconUrl: siteSettings?.favicon ? builder.image(siteSettings.favicon).url() : null,
    }

    res.json(siteSettingsWithUrls)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch site settings" })
  }
})

export default router