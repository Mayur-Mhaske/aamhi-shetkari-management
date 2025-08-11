import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showPaymentInput, setShowPaymentInput] = useState(null); // srNo of customer
  const [paymentAmount, setPaymentAmount] = useState("");

  const fetchLedger = () => {
    axios
      .get("http://localhost:5000/api/daily-entry/full-ledger-grouped")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Fetch failed", err));
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleAddPayment = async (srNo) => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/customers/${srNo}/payment`, {
        amount,
      });

      setPaymentAmount("");
      setShowPaymentInput(null);
      fetchLedger(); // Refresh UI
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed");
    }
  };

  const filtered = customers.filter(
    (cust) =>
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      String(cust.srNo).startsWith(search)
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Customers Ledger</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or Sr No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Customer Tables */}
      {filtered.map((cust, index) => (
        <div key={index} className="bg-white shadow-md p-4 mb-6 rounded">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              {cust.name} (Sr No: {cust.srNo})
            </h2>
            <p className="text-red-600 font-bold">
              Total Udhar: ₹
              {cust.entries.reduce(
                (sum, entry) =>
                  sum + (entry.totalAmount || 0) - (entry.paidAmount || 0),
                0
              )}
            </p>
          </div>

          <table className="w-full border text-sm mb-2">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Item</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Paid</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {cust.entries.map((entry, i) => (
                <tr key={i}>
                  <td className="border p-2">{entry.date}</td>
                  <td className="border p-2">
                    {new Date(entry.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="border p-2">
                    {Array.isArray(entry.items)
                      ? entry.items.map((item, idx) => (
                          <div key={idx}>
                            {item.itemName} × {item.quantity}
                          </div>
                        ))
                      : entry.item}
                  </td>
                  <td className="border p-2">
                    ₹{entry.totalAmount || entry.amount}
                  </td>
                  <td className="border p-2">₹{entry.paidAmount || 0}</td>
                  <td
                    className={`border p-2 ${
                      entry.paymentStatus === "Unpaid"
                        ? "text-red-600"
                        : entry.paymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {entry.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Payment Input */}
          {showPaymentInput === cust.srNo ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                className="border p-1 rounded w-32"
              />
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => handleAddPayment(cust.srNo)}
              >
                Submit
              </button>
              <button
                className="text-gray-500 text-sm"
                onClick={() => setShowPaymentInput(null)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="text-blue-600 underline text-sm"
              onClick={() => {
                setShowPaymentInput(cust.srNo);
                setPaymentAmount("");
              }}
            >
              + Add Payment
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
