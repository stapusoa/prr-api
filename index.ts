import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { getSanityClient } from "./src/lib/cms/sanityClient";
import { PAGE_QUERY } from "./src/lib/cms/queries";
import { getFilteredListings } from "./src/lib/cms/utils/propertyUtils";
import { fetchProperties } from "./src/lib/cms/data/fetchProperties";

dotenv.config(); // Load environment variables from .env

const app = express();

// -------- PAGE ROUTE --------
app.get("/page/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const client = getSanityClient();

  try {
    const page = await client.fetch(PAGE_QUERY, { slug });

    if (!page) return res.status(404).send("Page not found");

    const ogImage = page.hero?.heroImageSM?.asset?.url ?? "";

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${page.title || ""}</title>
        <meta name="description" content="${page.metaDescription || ""}" />
        <link rel="canonical" href="https://plantingrootsrealty.com/${slug}" />
        <meta property="og:title" content="${page.title || ""}" />
        <meta property="og:description" content="${page.metaDescription || ""}" />
        ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ""}
      </head>
      <body>
        <div id="root">
          <h1>${page.hero?.title || ""}</h1>
          <p>${page.hero?.subheader || ""}</p>
          <div>
            ${page.body?.map((block: any) =>
              block.children?.map((child: any) => child.text).join("")
            ).join("<br>")}
          </div>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// -------- LISTINGS ROUTE --------
app.get("/listings", async (req: Request, res: Response) => {
  try {
    // Fetch all properties from Sanity
    const properties = await fetchProperties()

    // Extract filters, searchQuery, and sortBy from query params
    const filters = req.query.filters
      ? JSON.parse(req.query.filters as string)
      : { priceRange: [0, Infinity], propertyTypes: [], bedrooms: "any", bathrooms: "any" }

    const searchQuery = (req.query.searchQuery as string) || ""
    const sortBy = (req.query.sortBy as string) || "price-low"

    const filtered = getFilteredListings(properties, filters, searchQuery, sortBy)
    res.json(filtered)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

// -------- START SERVER --------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));