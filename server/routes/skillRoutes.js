import express from "express";
import Skill from "../models/Skill.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// 🔹 Create Skill
router.post("/add", authMiddleware, async (req, res) => {
  const { name, level } = req.body;
  const userId = req.user.id;

  try {
    const count = await Skill.countDocuments({ userId });

    if (!req.user.isPaid && count >= 3) {
      return res.status(403).json({ error: "Free users can add only 3 skills" });
    }

    const newSkill = new Skill({ name, level, userId });
    await newSkill.save();
    res.status(201).json({ msg: "Skill added successfully", skill: newSkill });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Get All Skills
router.get("/", authMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.id });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Delete Skill
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ msg: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Update Skill
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSkill);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
