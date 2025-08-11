import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DailyEntry() {
  const [customerInput, setCustomerInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [allCustomers, setAllCustomers] = useState([]);

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemList, setItemList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paidAmount, setPaidAmount] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const [sellingPrice, setSellingPrice] = useState("");
  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get("http://localhost:5000/api/customers");
    setAllCustomers(res.data);
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/warehouse/items");
      setItems(res.data);
    } catch (err) {
      alert("Failed to load warehouse items.");
    }
  };

  const handleCustomerInput = (e) => {
    const input = e.target.value;
    setCustomerInput(input);
    const filtered = allCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(input.toLowerCase()) ||
        String(c.srNo).startsWith(input)
    );
    setFilteredCustomers(filtered);
  };

  const handleCustomerSelect = (cust) => {
    setSelectedCustomer(cust);
    setCustomerInput(cust.name);
    setFilteredCustomers([]);
  };

  const handleAddNewCustomer = async () => {
    if (!customerInput) {
      alert("Please enter customer name to add.");
      return;
    }

    const newSrNo = Math.max(0, ...allCustomers.map((c) => c.srNo)) + 1;

    try {
      await axios.post("http://localhost:5000/api/customers", {
        srNo: newSrNo,
        name: customerInput,
      });

      await fetchCustomers();
      const newCust = { srNo: newSrNo, name: customerInput };
      setSelectedCustomer(newCust);
      alert("Customer added!");
    } catch (err) {
      console.error("Error adding new customer:", err);
    }
  };

  const handleAddItem = () => {
    const qty = Number(quantity);
    const price = Number(sellingPrice);
    if (!selectedItem || qty <= 0 || price <= 0) {
      alert("Please select a valid item, quantity, and selling price.");
      return;
    }

    const itemDetails = items.find((i) => i.itemName === selectedItem);
    if (!itemDetails) {
      alert("Item not found.");
      return;
    }

    if (qty > itemDetails.remainingStock) {
      alert(
        `❌ Cannot sell ${qty} units of \"${itemDetails.itemName}\". Only ${itemDetails.remainingStock} left in stock.`
      );
      return;
    }

    const total = price * qty;

    setItemList([
      ...itemList,
      {
        itemName: itemDetails.itemName,
        price,
        costPrice: itemDetails.costPrice || 0,
        quantity: qty,
        total,
      },
    ]);

    setSelectedItem("");
    setQuantity("");
    setSellingPrice("");
  };

  const handleDeleteItem = (index) => {
    const newList = [...itemList];
    newList.splice(index, 1);
    setItemList(newList);
  };

  const grandTotal = itemList.reduce((acc, item) => acc + item.total, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    const paid =
      paymentStatus === "Partially Paid"
        ? Number(paidAmount)
        : paymentStatus === "Paid"
        ? grandTotal
        : 0;

    if (itemList.length === 0 && paid === 0) {
      alert("Please add at least one item or some payment.");
      return;
    }

    if (paymentStatus === "Partially Paid") {
      if (isNaN(paid) || paid < 0 || paid > grandTotal) {
        alert("Enter valid partial paid amount.");
        return;
      }
    }

    const sanitizedItems = itemList.map((item) => ({
      itemName: item.itemName,
      price: Number(item.price),
      costPrice: Number(item.costPrice || 0),
      quantity: Number(item.quantity),
      total: Number(item.total),
    }));

    const data = {
      srNo: Number(selectedCustomer.srNo),
      name: selectedCustomer.name,
      date: today,
      items: sanitizedItems,
      totalAmount: grandTotal,
      paidAmount: paid,
      paymentStatus,
    };

    try {
      await axios.post("http://localhost:5000/api/daily-entry", data);
      alert("Data submitted successfully!");

      // Reset
      setCustomerInput("");
      setSelectedCustomer(null);
      setItemList([]);
      setSelectedItem("");
      setQuantity("");
      setPaymentStatus("Unpaid");
      setPaidAmount("");
    } catch (err) {
      console.error("Error submitting:", err);
      if (err.response) {
        alert("Server error: " + JSON.stringify(err.response.data));
      } else {
        alert("Unknown error: " + err.message);
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daily Data Entry</h1>

      {/* Customer Input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Customer</label>
        <input
          type="text"
          value={customerInput}
          onChange={handleCustomerInput}
          placeholder="Enter Name or Sr No"
          className="w-full border p-2 rounded"
        />
        {filteredCustomers.length > 0 && (
          <ul className="bg-white border rounded mt-1 max-h-40 overflow-y-auto">
            {filteredCustomers.map((cust) => (
              <li
                key={cust.srNo}
                className="p-2 hover:bg-purple-100 cursor-pointer"
                onClick={() => handleCustomerSelect(cust)}
              >
                {cust.srNo}. {cust.name}
              </li>
            ))}
          </ul>
        )}
        {!filteredCustomers.length &&
          customerInput &&
          !allCustomers.some(
            (c) =>
              c.name.trim().toLowerCase() === customerInput.trim().toLowerCase()
          ) && (
            <p className="text-sm mt-1">
              No customer found.{" "}
              <span
                className="text-blue-600 cursor-pointer underline"
                onClick={handleAddNewCustomer}
              >
                Add new?
              </span>
            </p>
          )}
      </div>

      {/* Item Selection */}
      <div className="mb-4 flex gap-2">
        <div className="w-1/3">
          <label className="block mb-1 font-medium">Item</label>
          <select
            value={selectedItem}
            onChange={(e) => {
              setSelectedItem(e.target.value);
              const found = items.find((i) => i.itemName === e.target.value);
              setSellingPrice(found ? found.price : "");
            }}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.itemName} value={item.itemName}>
                {item.itemName} - ₹{item.price} (Stock: {item.remainingStock})
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/4">
          <label className="block mb-1 font-medium">Qty</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="w-1/4">
          <label className="block mb-1 font-medium">Selling Price</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="w-full border p-2 rounded"
            min={1}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleAddItem}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Items List */}
      {itemList.length > 0 && (
        <div className="mb-4">
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Item</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {itemList.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">₹{item.price}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">₹{item.total}</td>
                  <td className="border p-2">
                    <button
                      className="text-red-600 font-bold"
                      onClick={() => handleDeleteItem(index)}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total and Payment */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Total Amount: ₹{grandTotal}
        </label>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Payment</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partially Paid">Partially Paid</option>
        </select>
      </div>

      {paymentStatus === "Partially Paid" && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Paid Amount</label>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="w-full border p-2 rounded"
            min="0"
            max={grandTotal}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
      >
        Submit
      </button>
    </div>
  );
}
