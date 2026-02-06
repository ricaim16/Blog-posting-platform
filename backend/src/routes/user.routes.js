import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";
import {
  updateProfilePicture,
  deleteProfilePicture,
} from "../controllers/user.controller.js";

const router = express.Router();

// PUT route: upload
router.put("/profile-picture", protect, uploadSingle, updateProfilePicture);

// DELETE route
router.delete("/profile-picture", protect, deleteProfilePicture);

export default router;
