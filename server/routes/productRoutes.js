import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

// Add new product
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });
    const prod = new Product({ name: name.trim() });
    await prod.save();
    res.json({ success: true, product: prod });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
import productRoutes from "./routes/productRoutes.js";
app.use("/api/products", productRoutes);