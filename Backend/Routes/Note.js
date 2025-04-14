import express from "express";
import {
  createNote,
  getUserNotes,
  getUserQuestionNotes,
  handleDeleteNote,
  handleGetNoteById,
  handleUpdateNotes,
} from "../Controller/NotesController.js";
import { authenticateToken } from "../Middlewares/Auth.js";

const router = express.Router();

// Create a note (general or question)
router.post("/create", authenticateToken, createNote);

// Update any note by ID
router.put("/update", authenticateToken, handleUpdateNotes);

// Get all general notes of the user
router.get("/general", authenticateToken, getUserNotes);

// Get all question-specific notes of the user
router.get("/question", authenticateToken, getUserQuestionNotes);

// Get a note by its ID (general or question)
router.get("/:noteId", authenticateToken, handleGetNoteById);

//delete a note by its ID
router.delete("/:noteId", authenticateToken, handleDeleteNote);
export default router;
