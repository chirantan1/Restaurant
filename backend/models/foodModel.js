const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    foodTags: { type: Array, default: [] },
    code: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);