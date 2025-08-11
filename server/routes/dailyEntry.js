import express from 'express';
import DailyEntry from '../models/DailyEntry.js';
import WarehouseItem from '../models/WarehouseItem.js';

const router = express.Router();

/** 🔄 POST: Save new daily entry + update warehouse stock */
router.post('/', async (req, res) => {
  try {
    const {
      srNo,
      name,
      date,
      items,
      totalAmount,
      paidAmount,
      paymentStatus,
    } = req.body;

    // Validate required fields
    if (
      srNo === undefined ||
      srNo === null ||
      name === undefined ||
      name === null ||
      typeof totalAmount !== "number" ||
      isNaN(totalAmount) ||
      typeof paidAmount !== "number" ||
      isNaN(paidAmount) ||
      !paymentStatus
    ) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Items must be an array" });
    }

    // ✅ Validate each item
    if (items.length > 0) {
      for (const item of items) {
        if (
          !item.itemName ||
          typeof item.price !== "number" ||
          isNaN(item.price) ||
          typeof item.costPrice !== "number" ||         // ✅ Now required
          isNaN(item.costPrice) ||                      // ✅ Now required
          typeof item.quantity !== "number" ||
          isNaN(item.quantity) ||
          item.quantity < 1 ||
          typeof item.total !== "number" ||
          isNaN(item.total)
        ) {
          return res.status(400).json({ error: "Invalid item in items array" });
        }

        const warehouseItem = await WarehouseItem.findOne({ itemName: item.itemName });
        if (!warehouseItem) {
          return res.status(400).json({
            error: `Warehouse item '${item.itemName}' not found. Please add it to warehouse first.`,
          });
        }
      }
    }

    // ✅ Create new entry
    const entry = new DailyEntry({
      srNo,
      name,
      date,
      items,
      totalAmount,
      paidAmount,
      paymentStatus,
    });

    await entry.save();

    // ✅ Update warehouse stock
    if (items.length > 0) {
      const today = new Date().toISOString().split("T")[0];

      for (const item of items) {
        const { itemName, quantity } = item;

        const warehouseItem = await WarehouseItem.findOne({ itemName });

        if (!warehouseItem) {
          return res.status(400).json({
            error: `Warehouse item '${itemName}' not found. Please add it to warehouse first.`,
          });
        }

        warehouseItem.remainingStock -= quantity;
        if (warehouseItem.remainingStock < 0) warehouseItem.remainingStock = 0;

        warehouseItem.soldHistory.push({
          quantity,
          date: today,
        });

        await warehouseItem.save();
      }
    }

    res.json({ success: true, entry });
  } catch (err) {
    console.error("Daily entry save error:", err.message, err.stack);
    res.status(500).json({ error: "Failed to save entry", details: err.message });
  }
});

/** 🧾 GET: Full ledger grouped by customer */
router.get('/full-ledger-grouped', async (req, res) => {
  try {
    const entries = await DailyEntry.find().sort({ createdAt: 1 });

    const customerMap = new Map();
    for (const entry of entries) {
      const key = `${entry.srNo}|${entry.name}`;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          srNo: entry.srNo,
          name: entry.name,
          entries: [],
        });
      }
      customerMap.get(key).entries.push(entry);
    }

    const result = Array.from(customerMap.values());
    res.json(result);
  } catch (err) {
    console.error("Ledger fetch error:", err);
    res.status(500).json({ error: "Failed to fetch ledger" });
  }
});

export default router;
