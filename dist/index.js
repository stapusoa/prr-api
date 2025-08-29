import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getSanityClient } from "./src/lib/cms/sanityClient.js";
import { PAGE_QUERY } from "./src/lib/cms/queries/index.js";
import { getFilteredListings } from "./src/lib/cms/utils/propertyUtils.js";
import { fetchProperties } from "./src/lib/cms/data/fetchProperties.js";
dotenv.config(); // Load environment variables from .env
const app = express();
const allowedOrigins = [
    "http://localhost:5173", // dev
    "http://localhost:3000", // dev
    process.env.FRONTEND_URL, // production (set this in your .env file)
].filter((origin) => typeof origin === "string" && origin.length > 0);
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
}));
app.use(express.json());
// -------- PAGE ROUTE --------
app.get("/page/:slug", async (req, res) => {
    const { slug } = req.params;
    const client = getSanityClient();
    try {
        const page = await client.fetch(PAGE_QUERY, { slug });
        if (!page)
            return res.status(404).json({ error: "Page not found" });
        res.json(page);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
// -------- LISTINGS ROUTE --------
app.get("/listings", async (req, res) => {
    try {
        // Fetch all properties from Sanity
        const properties = await fetchProperties();
        // Extract filters, searchQuery, and sortBy from query params
        const filters = req.query.filters
            ? JSON.parse(req.query.filters)
            : { priceRange: [0, Infinity], propertyTypes: [], bedrooms: "any", bathrooms: "any" };
        const searchQuery = req.query.searchQuery || "";
        const sortBy = req.query.sortBy || "price-low";
        const filtered = getFilteredListings(properties, filters, searchQuery, sortBy);
        res.json(filtered);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});
// -------- START SERVER --------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
