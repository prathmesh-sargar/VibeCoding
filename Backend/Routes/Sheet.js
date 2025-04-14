import express from "express";
import { authenticateToken } from "../Middlewares/Auth.js";
import {
  handleCreateSheet,
  handleFetchAndAddQuestions,
  handleFollowSheet,
  handleGetAllSheets,
  handleGetFollowedSheets,
  handleGetSheetById,
} from "../Controller/SheetController.js";
import {
  handleGetSolvedQuestionsByUser,
  handleMarkQuestionAsSolved,
} from "../Controller/QuestionController.js";

const router = express.Router();

// Create a new sheet
router.post("/create",authenticateToken, handleCreateSheet);

// Add questions to a sheet using sheetId as route param
router.post("/fetch-and-add-questions", handleFetchAndAddQuestions);

// Follow/unfollow a sheet
router.post("/follow", authenticateToken, handleFollowSheet);

// Mark a question as solved
router.post("/question/mark-solved", authenticateToken, handleMarkQuestionAsSolved);

// Get all sheets
router.get("/", authenticateToken, handleGetAllSheets);

// Get detailed info about a sheet
router.post("/details", authenticateToken, handleGetSheetById);

// Get followed sheets
router.get("/followed/list", authenticateToken, handleGetFollowedSheets);

// Get solved questions by user
router.get("/solved", authenticateToken, handleGetSolvedQuestionsByUser);

export default router;
