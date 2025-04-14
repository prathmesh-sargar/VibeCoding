import express from "express";
import { handleanalyzepdf } from "../Controller/ResumeAnalyze.js";
import uploadMiddleware from "../Middlewares/Multer.js";
import { authenticateToken } from "../Middlewares/Auth.js";

const router = express.Router();

router.post("/analyze",authenticateToken,uploadMiddleware, handleanalyzepdf);


export default router;
