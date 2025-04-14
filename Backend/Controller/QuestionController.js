// Ensure this model is imported

import Notes from "../Model/Notes.js";
import User from "../Model/User.js";

// Controller to mark a question as solved
const handleMarkQuestionAsSolved = async (req, res) => {
    try {
      const { sheetId, questionId } = req.body;
      const userId = req.user.id;
  
      if (!userId || !sheetId || !questionId) {
        return res.status(400).json({
          error: "User ID, Sheet ID, and Question ID are required",
        });
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // Find the sheet in user's followed sheets
      const sheetIndex = user.sheets.findIndex(
        (s) => s.sheet_id.toString() === sheetId
      );
  
      if (sheetIndex === -1) {
        return res.status(400).json({
          error: "You need to follow this sheet first",
        });
      }
  
      let solvedQuestions = user.sheets[sheetIndex].solved_questions;
  
      // Check if the question is already marked as solved
      const existingIndex = solvedQuestions.findIndex(
        (q) => q.question_id.toString() === questionId
      );
  
      let message = "";
  
      if (existingIndex !== -1) {
        // If already solved, remove it (mark as unsolved)
        user.sheets[sheetIndex].solved_questions.splice(existingIndex, 1);
        message = "Question marked as unsolved successfully";
      } else {
        // Otherwise, mark it as solved
        user.sheets[sheetIndex].solved_questions.push({
          question_id: questionId,
          status: "Completed",
        });
        message = "Question marked as solved successfully";
      }
  
      await user.save();
  
      const { password: _, ...userWithoutPassword } = user._doc;
      return res.status(200).json({
        message,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Error marking question status:", error);
      return res
        .status(500)
        .json({ error: "Server error. Please try again later." });
    }
  };
  

// Controller to fetch solved questions by user
const handleGetSolvedQuestionsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from request

    // Fetch user and populate solved questions
    const user = await User.findById(userId).populate({
      path: "sheets.solved_questions.question_id",
      model: "Question",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    let solvedQuestions = [];

    // Iterate through all solved questions to check for notes
    for (const sheetProgress of user.sheets) {
      for (const solved of sheetProgress.solved_questions) {
        const question = solved.question_id; // Already populated

        if (question) {
          // Check if a note exists for this question and user
          const note = await Notes.findOne({
            user: userId, // User who created the note
            question_id: question._id, // Corrected field name
          });

          solvedQuestions.push({
            questionId: question._id,
            title: question.title,
            platform: question.platform,
            url: question.url,
            difficulty: question.difficulty,
            topicTags: question.topicTags,
            sheetId: sheetProgress.sheet_id, // Reference to which sheet it belongs
            note: note ? note._id : null, // If no note exists, return null
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: solvedQuestions,
    });
  } catch (error) {
    console.error("Error fetching solved questions:", error);
    return res.status(500).json({
      success: false,
      error: "Server error. Please try again later.",
    });
  }
};

export { handleMarkQuestionAsSolved, handleGetSolvedQuestionsByUser };
