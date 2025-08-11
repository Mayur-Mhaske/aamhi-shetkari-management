import express from "express";
import { registerUser , loginUser} from "../controllers/authController.js";
import auth from "../middleware/auth.js";



const router = express.Router();

router.post("/register",registerUser);
router.post("/login", loginUser);
router.get("/dashboard", auth, (req, res) => {
  res.json({ msg: "Welcome to protected dashboard" });
});

// server/routes/auth.js
router.get("/dashboard", auth, (req, res) => {
  res.json({ msg: "Welcome to protected dashboard" });
});



export default router;
