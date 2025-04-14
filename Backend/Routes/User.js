import express from "express";
import {
  handleEditUser,
  handleGetUser,
  handleLogin,
  handleSignUp,
} from "../Controller/UserController.js";
import { authenticateToken } from "../Middlewares/Auth.js";
const router = express.Router();

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.get("/", authenticateToken, handleGetUser);
router.put("/edit", authenticateToken, handleEditUser);

export default router;
