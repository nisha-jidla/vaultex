const User = require("../models/User");

// ── GET /profile ───────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Server error fetching profile." });
  }
};

// ── PUT /profile ───────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // Only allow updating name and avatar (not email/password here)
    const updates = {};
    if (name) updates.name = name.trim();
    if (avatar) updates.avatar = avatar;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields provided to update." });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server error updating profile." });
  }
};

// ── PUT /change-password ───────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error changing password." });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
