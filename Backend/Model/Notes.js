import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["question", "general"],
    required: true,
  },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  noteName: { type: String },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Note", NoteSchema);
