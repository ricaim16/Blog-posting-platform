import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// READ (public)
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// CREATE (auth)
router.post("/", protect, createBlog);

// UPDATE & DELETE (owner only)
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
