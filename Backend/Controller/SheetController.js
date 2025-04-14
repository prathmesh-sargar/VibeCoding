import Sheet from "../Model/Sheet.js";
import User from "../Model/User.js";
import axios from "axios";
import Question from "../Model/Question.js";
import Notes from "../Model/Notes.js";

// ************************ Create Sheet ************************
const handleCreateSheet = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userID=req.user.id;
    if (!title ) {
      return res.status(400).json({ error: "Title is required." });
    }
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ error: "Author not found." });

    const newSheet = await Sheet.create({ title, description, author:userID });

    return res.status(201).json({
      message: "Sheet created successfully.",
      sheet: newSheet,
    });
  } catch (error) {
    console.error("Create Sheet Error:", error);
    return res.status(500).json({ error: "Server error. Try again later." });
  }
};

// ************************ Fetch and Add Questions ************************
const handleFetchAndAddQuestions = async (req, res) => {
  try {
    const { sheetId } = req.body;
    if (!sheetId) return res.status(400).json({ error: "Sheet ID required." });

    const sheet = await Sheet.findById(sheetId);
    if (!sheet) return res.status(404).json({ error: "Sheet not found." });

    const { data } = await axios.get("https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet");
    const questionsData = data?.data?.questions;

    if (!Array.isArray(questionsData)) {
      return res.status(400).json({ error: "Invalid API response." });
    }

    const questionIds = [];

    for (const item of questionsData) {
      const q = item.questionId;

      let existing = await Question.findOne({ title: q.name });
      if (!existing) {
        existing = await Question.create({
          title: q.name,
          platform: q.platform,
          url: q.problemUrl,
          difficulty: q.difficulty,
          topic: item.topic,
          topicTags: q.topics,
        });
      }

      if (!sheet.questions.includes(existing._id)) {
        questionIds.push(existing._id);
      }
    }

    if (questionIds.length === 0) {
      return res.status(200).json({ message: "No new questions to add." });
    }

    sheet.questions.push(...questionIds);
    await sheet.save();

    return res.status(200).json({ message: "Questions added.", sheet });
  } catch (error) {
    console.error("Fetch/Add Questions Error:", error);
    return res.status(500).json({ error: "Server error." });
  }
};

// ************************ Follow / Unfollow Sheet ************************
const handleFollowSheet = async (req, res) => {
  try {
    const { sheetId } = req.body;
    const userId = req.user.id;

    if (!sheetId || !userId) {
      return res.status(400).json({ error: "User ID and Sheet ID required." });
    }

    const [user, sheet] = await Promise.all([
      User.findById(userId),
      Sheet.findById(sheetId),
    ]);

    if (!user || !sheet) {
      return res.status(404).json({ error: "User or Sheet not found." });
    }

    const index = user.sheets.findIndex(s => s.sheet_id.toString() === sheetId);

    if (index !== -1) {
      user.sheets.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: "Unfollowed the sheet.", user });
    }

    user.sheets.push({ sheet_id: sheetId, solved_questions: [] });
    await user.save();

    const { password, ...rest } = user._doc;

    return res.status(200).json({
      message: "Followed the sheet.",
      user: rest,
    });
  } catch (error) {
    console.error("Follow Sheet Error:", error);
    return res.status(500).json({ error: "Server error." });
  }
};

// ************************ Get All Sheets ************************
const handleGetAllSheets = async (req, res) => {
  try {
    const sheets = await Sheet.find();
    return res.status(200).json({ success: true, data: sheets });
  } catch (error) {
    console.error("Get All Sheets Error:", error);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

// ************************ Get Sheet by ID ************************
const handleGetSheetById = async (req, res) => {
  try {
    const { sheetId } = req.body;
    const userId = req.user.id;

    const sheet = await Sheet.findById(sheetId).populate("questions");
    if (!sheet) return res.status(404).json({ error: "Sheet not found." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const notes = await Notes.find({ user: userId }).lean();
    const followed = user.sheets.find(s => s.sheet_id?.toString() === sheetId);
    const solvedSet = new Set(followed?.solved_questions.map(q => q.question_id.toString()) || []);

    const grouped = {};
    let totalSolved = 0;

    sheet.questions.forEach((q) => {
      const topic = q.topic;
      grouped[topic] = grouped[topic] || [];

      const note = notes.find(n => n.question_id?.toString() === q._id.toString());
      const isSolved = solvedSet.has(q._id.toString());

      grouped[topic].push({
        questionId: q._id,
        title: q.title,
        platform: q.platform,
        url: q.url,
        difficulty: q.difficulty,
        topicTags: q.topicTags,
        status: isSolved ? "Completed" : "Not Attempted",
        noteId: note?._id || null,
      });

      if (isSolved) totalSolved++;
    });

    const formatted = Object.entries(grouped).map(([topic, questions]) => ({ topic, questions }));

    return res.status(200).json({
      success: true,
      title: sheet.title,
      description: sheet.description,
      totalquestion: sheet.questions.length,
      totalsolved: totalSolved,
      data: formatted,
    });
  } catch (error) {
    console.error("Get Sheet by ID Error:", error);
    return res.status(500).json({ error: "Server error." });
  }
};

// ************************ Get Followed Sheets ************************
const handleGetFollowedSheets = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("sheets.sheet_id");

    if (!user) return res.status(404).json({ error: "User not found." });

    const followedSheets = user.sheets.map(({ sheet_id, solved_questions }) => ({
      id: sheet_id._id,
      title: sheet_id.title,
      description: sheet_id.description,
      totalQuestions: sheet_id.questions.length,
      solvedQuestions: solved_questions.length,
    }));

    return res.status(200).json({ success: true, data: followedSheets });
  } catch (error) {
    console.error("Get Followed Sheets Error:", error);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

export {
  handleCreateSheet,
  handleFollowSheet,
  handleGetAllSheets,
  handleGetSheetById,
  handleGetFollowedSheets,
  handleFetchAndAddQuestions,
};
