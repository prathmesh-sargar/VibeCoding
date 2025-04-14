import express from "express";
import {getGitHubUserData } from "../Controller/GithubController.js";
import { getAllLeetCodeData } from "../Controller/LeetcodeController.js";
import { getAllCodeforcesData } from "../Controller/CodeforcesController.js";
import { authenticateToken } from "../Middlewares/Auth.js";


const router = express.Router();

router.get("/github",authenticateToken, getGitHubUserData);
router.get("/codeforces",authenticateToken, getAllCodeforcesData);
router.get("/leetcode",authenticateToken, getAllLeetCodeData);




export default router;
