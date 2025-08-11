// server/routes/profile.js
import express from "express";
import { createProfile, getProfile } from "../controllers/profileController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createProfile);
router.get("/me", auth, getProfile);

export default router;
