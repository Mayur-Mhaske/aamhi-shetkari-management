import mongoose from "mongoose";
// models/WarehouseItem.js
const warehouseItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  costPrice: { type: Number, required: true ,min: 0,}, // ✅ ADD THIS
  totalStock: { type: Number, default: 0 },
  remainingStock: { type: Number, default: 0 },
  addedHistory: [
    {
      quantity: Number,
      date: String,
    },
  ],
  soldHistory: [
    {
      quantity: Number,
      date: String,
    },
  ],
});
const WarehouseItem = mongoose.model("WarehouseItem", warehouseItemSchema);
export default WarehouseItem;
