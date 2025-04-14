import mongoose from "mongoose";

const SheetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  visibility: {
    type: String,
    enum: ["Public", "Private"],
    default: "Public",
  },
});

export default mongoose.model("Sheet", SheetSchema);
