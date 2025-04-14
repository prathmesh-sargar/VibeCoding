import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/Connection.js";

import UserRouter from "./Routes/User.js";
import SheetRouter from "./Routes/Sheet.js";
import NoteRouter from "./Routes/Note.js";
import ProfileRouter from "./Routes/Profile.js";

import AIInterview from "./Routes/interviewRoutes.js";
import AnalyzeResume from "./Routes/ResumeAnalyze.js";
// import { checkAndSendEmails } from "./Controller/Mail.js";
import { authenticateToken } from "./Middlewares/Auth.js";
import { generateAIResponse } from "./Controller/Aiagent.js";
import { FetchInternships } from "./Controller/InternshipController.js";
import { checkAndSendEmails } from "./Controller/Mail.js";
dotenv.config();

const PORT = 4000;
const URI = process.env.MONGODB_URI;
const app = express();
connectDB(URI);

//Middlerwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check Route
app.get("/health", (req, res) => {
  res.send("OK");
});

// Routes
app.use("/api/user", UserRouter);
app.use("/api/sheets", SheetRouter);
app.use("/api/notes", NoteRouter);

app.use("/api/profile", ProfileRouter);
app.post("/api/aiagent", authenticateToken, generateAIResponse);

app.use("/api/aiinterview", AIInterview);
app.use("/api/resume", AnalyzeResume);

app.get("/api/jobs", FetchInternships);

// checkAndSendEmails()
app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
