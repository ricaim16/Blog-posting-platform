import express from "express";
import {
  rateBlog,
  updateRating,
  getBlogRatings,
} from "../controllers/rating.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:blogId", protect, rateBlog); // Create rating
router.put("/:blogId", protect, updateRating); // Update rating
router.get("/:blogId", getBlogRatings); // Get all ratings

export default router;
