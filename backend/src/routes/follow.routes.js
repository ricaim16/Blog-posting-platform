import express from "express";
import {
  toggleFollow,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:userId", protect, toggleFollow); // follow/unfollow
router.get("/followers/:userId", getFollowers); // get followers
router.get("/following/:userId", getFollowing); // get following

export default router;
