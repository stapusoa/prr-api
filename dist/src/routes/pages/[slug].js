// apps/api/src/routes/pages/[slug].ts
import { getSanityClient } from "../../lib/cms/sanityClient";
export default async function handler(req, res) {
    const { slug } = req.params; // from [slug].ts
    try {
        const client = getSanityClient(); // call the function
        const page = await client.fetch(`*[_type == "page" && slug.current == $slug][0]`, { slug });
        if (!page)
            return res.status(404).json({ error: "Page not found" });
        res.json(page);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
