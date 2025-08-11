import express from "express";
import DailyEntry from "../models/DailyEntry.js";

const router = express.Router();

/** 📅 GET: Monthly Summary */
router.get("/monthly-summary", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: "Month is required" });

    const entries = await DailyEntry.find({
      date: { $regex: `^${month}` },
    });

    let totalSales = 0;
    let cashReceived = 0;
    let expectedProfit = 0;
    let profitFromCash = 0;

    // 🔄 Group entries by customer
    const customerMap = new Map();

    for (let entry of entries) {
      const key = `${entry.srNo}|${entry.name}`;
      if (!customerMap.has(key)) {
        customerMap.set(key, []);
      }
      customerMap.get(key).push(entry);
    }

    for (let [key, custEntries] of customerMap.entries()) {
      let custSale = 0;
      let custPaid = 0;
      let custExpectedProfit = 0;

      for (let entry of custEntries) {
        custSale += entry.totalAmount;
        custPaid += entry.paidAmount;
        totalSales += entry.totalAmount;
        cashReceived += entry.paidAmount;

        if (!Array.isArray(entry.items) || entry.items.length === 0) continue;

        for (let item of entry.items) {
          const costPrice = item.costPrice ?? 0;
          const profit = (item.price - costPrice) * item.quantity;
          custExpectedProfit += profit;
        }
      }

      const ratio = custSale === 0 ? 0 : custPaid / custSale;
      const custCashProfit = custExpectedProfit * ratio;

      expectedProfit += custExpectedProfit;
      profitFromCash += custCashProfit;
    }

    res.json({
      month,
      totalSales,
      cashReceived,
      udharPending: totalSales - cashReceived,
      profitFromCash: Math.round(profitFromCash),
      expectedProfit: Math.round(expectedProfit),
    });
  } catch (err) {
    console.error("Monthly summary error:", err);
    res.status(500).json({ error: "Failed to fetch monthly summary" });
  }
});

export default router;
