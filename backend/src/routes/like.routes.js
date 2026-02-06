import express from "express";
import { toggleLike, getBlogLikes } from "../controllers/like.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET all likes for a blog (public)
router.get("/:blogId", getBlogLikes);

// TOGGLE like/unlike (auth required)
router.post("/:blogId", protect, toggleLike);

export default router;
