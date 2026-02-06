import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsForBlog,
} from "../controllers/comment.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET all comments for a blog (public)
router.get("/:blogId", getCommentsForBlog);

// CREATE comment (auth required)
router.post("/:blogId", protect, createComment);

// UPDATE comment (auth + owner only)
router.put("/edit/:id", protect, updateComment);

// DELETE comment (auth + owner only)
router.delete("/delete/:id", protect, deleteComment);

export default router;
