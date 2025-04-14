// models/CodeforcesData.js
import mongoose from "mongoose";

const CodeforcesDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  data: {
    type: Object,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CodeforcesData", CodeforcesDataSchema);
