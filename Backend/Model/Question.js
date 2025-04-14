import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  topicTags: [
    {
      type: String,
    },
  ],
});

export default mongoose.model("Question", QuestionSchema);
