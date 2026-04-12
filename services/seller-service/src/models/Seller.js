const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
      minlength: [2, "Store name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
    },
    storeDescription: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      street:  { type: String, default: "" },
      city:    { type: String, default: "" },
      country: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// Hash password before saving
sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
sellerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Seller", sellerSchema);
