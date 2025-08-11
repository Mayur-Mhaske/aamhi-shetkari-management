import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
});

export default mongoose.model("Product", productSchema);
