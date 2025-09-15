import express from "express"
import { getSanityClient } from "../lib/cms/sanityClient"
import { SITE_SETTINGS_QUERY } from "../lib/cms/queries/siteSettings"
import imageUrlBuilder from "@sanity/image-url"

const router = express.Router()

router.get("/site-settings", async (req, res) => {
  try {
    const client = getSanityClient()
    const data = await client.fetch(SITE_SETTINGS_QUERY)
    const builder = imageUrlBuilder(client)

    const siteSettings = data[0]
    const logoContrastUrl = siteSettings.logoContrast ? builder.image(siteSettings.logoContrast).url() : null
    const logoPrimaryUrl = siteSettings.logoPrimary ? builder.image(siteSettings.logoPrimary).url() : null

    res.json({
      ...siteSettings,
      logoContrastUrl,
      logoPrimaryUrl,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch site settings" })
  }
})

export default router