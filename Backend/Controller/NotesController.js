import mongoose from "mongoose";
import Note from "../Model/Notes.js";

// Create a new note
const createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, content, question_id, noteName } = req.body;

    if (!type || !content) {
      return res.status(400).json({
        success: false,
        message: "Type and content are required",
      });
    }

    if (type === "question" && !question_id) {
      return res.status(400).json({
        success: false,
        message: "question_id is required for question notes",
      });
    }

    if (type === "general" && !noteName) {
      return res.status(400).json({
        success: false,
        message: "noteName is required for general notes",
      });
    }

    const newNote = new Note({
      user: userId,
      type,
      content,
      question_id: type === "question" ? question_id : undefined,
      noteName: type === "general" ? noteName : undefined,
    });

    await newNote.save();

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: formatNoteResponse(newNote),
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a note
const handleUpdateNotes = async (req, res) => {
  try {
    const { noteId, content, noteName } = req.body;
    const userId = req.user.id;

    if (!noteId || !content) {
      return res.status(400).json({
        success: false,
        message: "noteId and content are required",
      });
    }

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    note.content = content;
    if (note.type === "general" && noteName) {
      note.noteName = noteName;
    }

    await note.save();

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: formatNoteResponse(note),
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get user's general notes
const getUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Note.find({ user: userId, type: "general" });

    return res.status(200).json({
      success: true,
      notes: notes.map(formatNoteResponse),
      message: notes.length
        ? "General notes fetched successfully"
        : "No general notes found",
    });
  } catch (error) {
    console.error("Error fetching general notes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's question notes
const getUserQuestionNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Note.find({ user: userId, type: "question" }).populate(
      "question_id",
      "title description"
    );

    return res.status(200).json({
      success: true,
      notes: notes.map(formatNoteResponse),
      message: notes.length
        ? "Question notes fetched successfully"
        : "No question notes found",
    });
  } catch (error) {
    console.error("Error fetching question notes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get note by ID (with question title and description if applicable)
const handleGetNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }

    const note = await Note.findById(noteId).populate(
      "question_id",
      "title description"
    );

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    if (note.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      note: formatNoteResponse(note),
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Format response
const formatNoteResponse = (note) => ({
  noteId: note._id,
  type: note.type,
  content: note.content,
  ...(note.type === "question" && note.question_id
    ? {
        question: {
          id: note.question_id._id,
          title: note.question_id.title,
        },
      }
    : {}),
  ...(note.type === "general"
    ? {
        noteName: note.noteName,
      }
    : {}),
});

// Delete a note
const handleDeleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Note.findByIdAndDelete(noteId);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export {
  createNote,
  handleUpdateNotes,
  handleGetNoteById,
  getUserNotes,
  getUserQuestionNotes,
  handleDeleteNote,
};