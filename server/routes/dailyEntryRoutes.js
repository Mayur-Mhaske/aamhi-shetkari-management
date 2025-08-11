import WarehouseItem from "../models/WarehouseItem.js";

router.post("/add", async (req, res) => {
  try {
    // Save daily entry here if needed

    // Update warehouse stock
    for (const item of req.body.items) {
      await WarehouseItem.findOneAndUpdate(
        { itemName: item.itemName },
        { $inc: { remainingStock: -item.quantity } }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add entry" });
  }
});