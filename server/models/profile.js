// server/models/Profile.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  branch: String,
  year: String,
  github: String,
  linkedin: String,
  resumeLink: String,
  skills: [String],
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
