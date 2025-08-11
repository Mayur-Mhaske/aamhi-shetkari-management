import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WarehouseDashboard() {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [report, setReport] = useState([]);

  // Load available months
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/warehouse/available-months")
      .then((res) => {
        setMonths(res.data);
        if (res.data.length > 0) {
          setSelectedMonth(res.data[0]);
        }
      })
      .catch(() => alert("Failed to load months"));
  }, []);

  // Fetch report for selected month
  useEffect(() => {
    if (!selectedMonth) return;

    axios
      .get(
        `http://localhost:5000/api/warehouse/monthly-report/${selectedMonth}`
      )
      .then((res) => setReport(res.data))
      .catch(() => alert("Failed to load report"));
  }, [selectedMonth]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        📦 Warehouse Dashboard (Monthly View)
      </h1>

      {/* Month Selector */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Select Month</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Monthly Report Table */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Stock Added</th>
            <th className="border p-2">Sold</th>
            <th className="border p-2">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {report.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.itemName}</td>
              <td className="border p-2">{item.stockAdded}</td>
              <td className="border p-2">{item.sold}</td>
              <td className="border p-2">{item.remaining}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
