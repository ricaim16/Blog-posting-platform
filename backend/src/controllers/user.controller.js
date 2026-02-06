import prisma from "../config/db.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js"; // your Cloudinary helper

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload buffer to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePicture: imageUrl },
      select: { id: true, username: true, name: true, profilePicture: true },
    });

    res.json({
      message: "Profile picture updated",
      profilePicture: imageUrl,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload", error: error.message });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePicture: null },
    });

    res.json({ message: "Profile picture removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete picture" });
  }
};
