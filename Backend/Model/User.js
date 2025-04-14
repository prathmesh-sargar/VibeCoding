import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: Object,
    default: {
      public_id: "amvfmhjviqpbmvu4txsf",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqf0Wx4wmsKfLYsiLdBx6H4D8bwQBurWhx5g&s",
    },
  },
  platforms: {
    github: { type: String, default: "" },
    leetcode: { type: String, default: "" },
    geeksforgeeks: { type: String, default: "" },
    codeforces: { type: String, default: "" },
  },
  sheets: [
    {
      sheet_id: { type: mongoose.Schema.Types.ObjectId, ref: "Sheet" },
      solved_questions: [
        {
          question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
          },
        },
      ],
    },
  ],
});

export default mongoose.model("User", UserSchema);
