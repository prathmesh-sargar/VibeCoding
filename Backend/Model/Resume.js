import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

export default mongoose.model("Resume", ResumeSchema);
