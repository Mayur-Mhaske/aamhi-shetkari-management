import React, { useState } from "react";
import axios from "axios";

export default function AddStockForm({ onStockAdded }) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState(""); // ✅ New state for cost price

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName || quantity <= 0 || price <= 0 || costPrice <= 0) {
      alert("Please fill all valid fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/warehouse/add-stock", {
        itemName,
        quantity: Number(quantity),
        price: Number(price),
        costPrice: Number(costPrice), // ✅ Send costPrice too
      });

      alert("Stock added successfully!");
      setItemName("");
      setQuantity("");
      setPrice("");
      setCostPrice(""); // ✅ Reset field
      if (onStockAdded) onStockAdded();
    } catch (err) {
      console.error("Error adding stock:", err);
      alert("Failed to add stock");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 flex-wrap items-end mb-6"
    >
      <div>
        <label className="block font-semibold mb-1">Item Name</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter item name"
          className="border p-2 rounded w-48"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
          className="border p-2 rounded w-32"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Selling Price ₹"
          className="border p-2 rounded w-32"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Cost Price</label>
        <input
          type="number"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          placeholder="Cost Price ₹"
          className="border p-2 rounded w-32"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Stock
      </button>
    </form>
  );
}
