const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    habitName: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["daily", "weekly", "medicine"],
      required: true,
    },

    frequency: {
      type: Number,
      default: 1,
      min: 1,
    },

    slots: [
      {
        name: { type: String, required: true },
        time: { type: Number, min: 0, max: 23 },
      },
    ],

    progress: [
      {
        date: {
          type: Date,
          required: true,
        },
        takenSlots: {
          type: [String],
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);