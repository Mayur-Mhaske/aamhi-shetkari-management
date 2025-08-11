import { useState, useEffect } from "react";
import axios from "axios";

export default function DailyEntryForm({ onEntryAdded }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/warehouse/items")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Failed to fetch items:", err);
        alert("Error loading items from warehouse.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = products.find((p) => p.itemName === selectedProduct);
    if (!product || quantity <= 0) {
      alert("Please select a valid product and quantity");
      return;
    }

    if (quantity > product.remainingStock) {
      alert("Not enough stock available");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/daily-entry", {
        items: [{ itemName: selectedProduct, quantity: Number(quantity) }],
        srNo: 1, // you can modify this
        name: "Walk-in", // replace with customer input if needed
        date: new Date().toISOString().split("T")[0],
        totalAmount: product.price * quantity,
        payment: "Unpaid", // replace if needed
      });

      alert("Sale entry added!");
      setSelectedProduct("");
      setQuantity("");
      if (onEntryAdded) onEntryAdded();
    } catch (err) {
      console.error("Entry error:", err?.response?.data || err.message);
      alert(
        err?.response?.data?.error ||
          "Failed to add sale entry. Please check server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-wrap gap-4 items-end"
    >
      <div>
        <label className="block font-semibold mb-1">Product</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border p-2 rounded w-60"
        >
          <option value="">Select Product</option>
          {products.map((item) => (
            <option key={item.itemName} value={item.itemName}>
              {item.itemName} (₹{item.price}) - Stock: {item.remainingStock}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded w-32"
          placeholder="Qty"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Add Sale Entry"}
      </button>
    </form>
  );
}
