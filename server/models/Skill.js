import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Skill", skillSchema);
