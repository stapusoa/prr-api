import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getSanityClient } from "./src/lib/cms/sanityClient.js";
import { PAGE_QUERY } from "./src/lib/cms/queries/index.js";
import { getFilteredListings } from "./src/lib/cms/utils/propertyUtils.js";
import { fetchProperties } from "./src/lib/cms/data/fetchProperties.js";
import { fileURLToPath } from "url";
import path from "path";
dotenv.config();
const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
].filter((origin) => typeof origin === "string" && origin.length > 0);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
}));
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = process.env.VERCEL
    ? path.join(process.cwd(), 'public', 'assets') // production
    : path.join(__dirname, '../public/assets'); // local
app.use('/assets', express.static(assetsPath));
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
