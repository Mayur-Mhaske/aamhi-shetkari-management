// server/controllers/profileController.js
import Profile from "../models/profile.js";

export const createProfile = async (req, res) => {
  try {
    const { branch, year, github, linkedin, resumeLink, skills } = req.body;

    const profile = new Profile({
      user: req.user.id,
      branch,
      year,
      github,
      linkedin,
      resumeLink,
      skills,
    });

    await profile.save();
    res.status(201).json({ msg: "Profile created successfully", profile });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", "name email");
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
