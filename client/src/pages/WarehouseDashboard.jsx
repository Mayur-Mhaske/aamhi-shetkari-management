import React, { useState, useEffect } from "react";
import AddStockForm from "../components/AddStockForm";
import axios from "axios";

export default function WarehouseDashboard() {
  const [items, setItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchAvailableMonths();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchMonthlyReport(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/warehouse/items");
      setItems(res.data);
    } catch (err) {
      alert("❌ Failed to load current warehouse items");
    }
  };

  const fetchAvailableMonths = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/warehouse/months");
      setAvailableMonths(res.data.months); // ✅ FIXED: extract 'months' array
    } catch (err) {
      console.error("❌ Failed to load months", err);
    }
  };

  const fetchMonthlyReport = async (month) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/warehouse/report/${month}`
      );
      setMonthlyReport(res.data);
    } catch (err) {
      alert("❌ Failed to load monthly report");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📦 Warehouse Dashboard</h1>

      <AddStockForm onStockAdded={fetchItems} />

      <h2 className="text-xl font-semibold mt-8 mb-2">
        📋 Current Available Stock
      </h2>
      <table className="w-full border text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Item</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Total Stock</th>
            <th className="border p-2">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No current items found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id}>
                <td className="border p-2">{item.itemName}</td>
                <td className="border p-2">₹{item.price}</td>
                <td className="border p-2">{item.totalStock}</td>
                <td className="border p-2">{item.remainingStock}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">📊 Monthly Stock Report</h2>

      <div className="mb-4">
        <label className="font-medium mr-2">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select Month --</option>
          {availableMonths.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {selectedMonth && (
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2">Stock Added</th>
              <th className="border p-2">Sold</th>
              <th className="border p-2">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {monthlyReport.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No data available for this month.
                </td>
              </tr>
            ) : (
              monthlyReport.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.stockAdded}</td>
                  <td className="border p-2">{item.sold}</td>
                  <td className="border p-2">{item.remaining}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
