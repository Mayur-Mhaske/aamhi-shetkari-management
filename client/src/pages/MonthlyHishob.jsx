import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MonthlyHishob() {
  const [month, setMonth] = useState("2025-06");
  const [summary, setSummary] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/summary/monthly-summary?month=${month}`
      );
      setSummary(res.data);
    } catch (err) {
      alert("Failed to load summary");
    }
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📆 Monthly हिसाब</h1>

      <label className="font-semibold">Select Month:</label>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 ml-2"
      />

      {summary && (
        <table className="w-full mt-6 border text-sm">
          <thead className="bg-purple-200">
            <tr>
              <th className="border px-4 py-2">Metric</th>
              <th className="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">📊 Total Sales</td>
              <td className="border px-4 py-2">₹ {summary.totalSales ?? 0}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">💸 Cash Received</td>
              <td className="border px-4 py-2">
                ₹ {summary.cashReceived ?? 0}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">🧾 Udhaar Pending</td>
              <td className="border px-4 py-2">
                ₹ {summary.udharPending ?? 0}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">💰 Profit from Cash</td>
              <td className="border px-4 py-2">
                ₹ {summary.profitFromCash ?? 0}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">📈 Expected Profit</td>
              <td className="border px-4 py-2">
                ₹ {summary.expectedProfit ?? 0}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
