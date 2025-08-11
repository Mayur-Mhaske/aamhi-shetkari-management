import express from 'express';
import DailyEntry from '../models/DailyEntry.js';

const router = express.Router();

// ✅ GET: Unique customers list
router.get('/', async (req, res) => {
  try {
    const entries = await DailyEntry.find();

    const customerMap = new Map();
    for (let entry of entries) {
      if (!customerMap.has(entry.srNo)) {
        customerMap.set(entry.srNo, entry.name);
      }
    }

    const customers = Array.from(customerMap, ([srNo, name]) => ({ srNo, name }));
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// ✅ POST: Add new customer with minimal valid schema
router.post('/', async (req, res) => {
  try {
    const { srNo, name } = req.body;

    // Check if already exists
    const exists = await DailyEntry.findOne({ srNo, name });
    if (exists) {
      return res.json({ message: "Customer already exists." });
    }

    // ✅ NEW SCHEMA COMPATIBLE dummy data
    const dummy = new DailyEntry({
      srNo,
      name,
      date: new Date().toISOString().split('T')[0],
      items: [
        {
          itemName: "Customer Created",
          price: 0,
          costPrice: 0,
          quantity: 1,
          total: 0,
        },
      ],
      totalAmount: 0,
      paidAmount: 0,
      paymentStatus: "Paid",
    });

    await dummy.save();
    res.json({ success: true, message: "Customer created." });
  } catch (err) {
    console.error("Customer creation failed:", err);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// Add payment to a customer
router.post('/:srNo/payment', async (req, res) => {
  try {
    const { srNo } = req.params;
    const { amount } = req.body;

    // Find the latest entry for the customer
    const entry = await DailyEntry.findOne({ srNo }).sort({ date: -1 });

    if (!entry) {
      return res.status(404).json({ error: "Customer not found" });
    }

    entry.paidAmount += amount;

    // Update paymentStatus and recalculate udhar if needed
    const udhar = entry.totalAmount - entry.paidAmount;
    entry.paymentStatus = udhar <= 0 ? "Paid" : "Unpaid";
    entry.udhar = udhar; // <-- Add this line if your schema supports it

    await entry.save();

    res.json({ 
      success: true, 
      message: "Payment added", 
      entry, 
      udhar // return updated udhar
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add payment" });
  }
});

export default router;
