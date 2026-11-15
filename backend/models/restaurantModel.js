const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the restaurant title"],
    },
    image: {
      type: String,
      default:
        "https://pixabay.com/images/download/wanderercreative-blank-profile-picture-973460_1920.png",
    },
    foodType: {
      type: [String],
      required: [true, "Please enter the food type"],
    },
    pickup: {
      type: Boolean,
      default: false,
    },
    delivery: {
      type: Boolean,
      default: false,
    },
    isopen: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
      default:
        "https://pixabay.com/images/download/wanderercreative-blank-profile-picture-973460_1920.png",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingcount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    coordinates: {
      id: { type: String },
      lattitude: {
        type: Number,
      },
      latitudeDelta: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      longitudeDelta: {
        type: Number,
      },
      title: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
