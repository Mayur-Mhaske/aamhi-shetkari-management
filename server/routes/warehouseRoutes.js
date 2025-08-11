// routes/warehouseRoutes.js
import express from "express";
import WarehouseItem from "../models/WarehouseItem.js";

const router = express.Router();

// 🔹 1. Add Stock
router.post("/add-stock", async (req, res) => {
  try {
    const { itemName, quantity, price, costPrice } = req.body;
    const date = new Date().toISOString().split("T")[0];

    if (!itemName || quantity <= 0 || price <= 0 || costPrice <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    let item = await WarehouseItem.findOne({ itemName });

    if (item) {
      item.totalStock += quantity;
      item.remainingStock += quantity;
      item.price = price;
      item.costPrice = costPrice;
      item.addedHistory.push({ quantity, date });
      await item.save();
    } else {
      item = new WarehouseItem({
        itemName,
        price,
        costPrice,
        totalStock: quantity,
        remainingStock: quantity,
        addedHistory: [{ quantity, date }],
      });
      await item.save();
    }

    res.json({ success: true, item });
  } catch (err) {
    console.error("Add stock error:", err.message, err.stack);
    res.status(500).json({ error: "Add stock failed", details: err.message });
  }
});

// 🔹 2. Deduct Stock
router.post("/deduct", async (req, res) => {
  try {
    const { itemName, quantity, paymentMode } = req.body;
    const date = new Date().toISOString().split("T")[0];

    const item = await WarehouseItem.findOne({ itemName });
    if (!item) {
      return res.status(400).json({ error: `Item '${itemName}' not found.` });
    }

    if (item.remainingStock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    item.remainingStock -= quantity;
    item.soldHistory.push({ quantity, date, paymentMode });
    await item.save();

    res.json({ success: true, item });
  } catch (err) {
    console.error("Deduct stock error:", err);
    res.status(500).json({ error: "Deduct stock failed" });
  }
});

// 🔹 3. Get Warehouse Report
router.get("/report", async (req, res) => {
  try {
    const items = await WarehouseItem.find();
    const today = new Date().toISOString().split("T")[0];
    const month = today.slice(0, 7);

    const report = items.map((item) => {
      const dailySold = item.soldHistory
        .filter((e) => e.date === today)
        .reduce((sum, e) => sum + e.quantity, 0);

      const monthlySold = item.soldHistory
        .filter((e) => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.quantity, 0);

      return {
        itemName: item.itemName,
        totalStock: item.totalStock,
        remainingStock: item.remainingStock,
        dailySold,
        monthlySold,
      };
    });

    res.json(report);
  } catch (err) {
    console.error("Report fetch error:", err);
    res.status(500).json({ error: "Report generation failed" });
  }
});

// 🔹 4. Get All Available Items
router.get("/items", async (req, res) => {
  try {
    const items = await WarehouseItem.find({}, "itemName price costPrice remainingStock");
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to load items" });
  }
});

// 🔹 5. Get All Unique Months From Stock History
router.get("/months", async (req, res) => {
  try {
    const items = await WarehouseItem.find({}, "addedHistory soldHistory");

    const allDates = [];

    items.forEach(item => {
      item.addedHistory.forEach(entry => allDates.push(entry.date));
      item.soldHistory.forEach(entry => allDates.push(entry.date));
    });

    const uniqueMonths = [...new Set(
      allDates
        .map(date => date.slice(0, 7))
        .filter(Boolean)
    )].sort().reverse();

    res.json({ months: uniqueMonths });
  } catch (err) {
    console.error("Failed to fetch months:", err);
    res.status(500).json({ error: "Failed to fetch months" });
  }
});

// 🔹 6. Monthly Report with Profit Metrics
router.get("/report/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const items = await WarehouseItem.find();

    let totalSales = 0;
    let cashSales = 0;
    let expectedProfit = 0;
    let profitFromCash = 0;

    const report = items.map((item) => {
      const stockAdded = item.addedHistory
        .filter((e) => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.quantity, 0);

      const soldEntries = item.soldHistory.filter((e) =>
        e.date.startsWith(month)
      );

      const sold = soldEntries.reduce((sum, e) => sum + e.quantity, 0);
      const itemTotalSales = sold * item.price;
      const itemProfit = sold * (item.price - item.costPrice);

      const cashQuantity = soldEntries
        .filter((e) => e.paymentMode === "cash")
        .reduce((sum, e) => sum + e.quantity, 0);

      const itemCashSales = cashQuantity * item.price;
      const itemCashProfit = cashQuantity * (item.price - item.costPrice);

      totalSales += itemTotalSales;
      expectedProfit += itemProfit;
      cashSales += itemCashSales;
      profitFromCash += itemCashProfit;

      return {
        itemName: item.itemName,
        stockAdded,
        sold,
        remaining: item.remainingStock,
      };
    });

    res.json({
      report,
      totalSales,
      cashSales,
      udhaarPending: totalSales - cashSales,
      expectedProfit,
      profitFromCash,
    });
  } catch (err) {
    console.error("Monthly report error:", err);
    res.status(500).json({ error: "Failed to fetch monthly report" });
  }
});

export default router;
