import express from "express";
import { searchUsers, searchBlogs } from "../controllers/search.controller.js";

const router = express.Router();

// GET /api/search/users?q=<query>
router.get("/users", searchUsers);

// GET /api/search/blogs?q=<query>
router.get("/blogs", searchBlogs);

export default router;
