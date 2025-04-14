import mongoose from "mongoose";

const leetCodeDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  username: { type: String, required: true },
  stats: Array,
  submissionCalendar: mongoose.Schema.Types.Mixed,
  topicAnalysisStats: mongoose.Schema.Types.Mixed,
  awards: Array,
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("LeetCodeData", leetCodeDataSchema);
