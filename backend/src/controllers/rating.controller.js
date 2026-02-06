import prisma from "../config/db.js";

/* ======================
   CREATE RATING
====================== */
export const rateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { value } = req.body;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be 1–5" });
    }

    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const existingRating = await prisma.blogRating.findUnique({
      where: { userId_blogId: { userId: req.user.id, blogId } },
    });

    if (existingRating) {
      return res
        .status(400)
        .json({ message: "Rating already exists. Use PUT to update." });
    }

    const rating = await prisma.blogRating.create({
      data: { value, userId: req.user.id, blogId },
    });

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: "Failed to rate blog" });
  }
};

/* ======================
   UPDATE RATING (OWNER ONLY)
====================== */
export const updateRating = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { value } = req.body;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be 1–5" });
    }

    const existingRating = await prisma.blogRating.findUnique({
      where: { userId_blogId: { userId: req.user.id, blogId } },
    });

    if (!existingRating) {
      return res
        .status(404)
        .json({ message: "Rating not found for this user" });
    }

    const updated = await prisma.blogRating.update({
      where: { userId_blogId: { userId: req.user.id, blogId } },
      data: { value },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update rating" });
  }
};

/* ======================
   GET ALL RATINGS FOR A BLOG
====================== */
export const getBlogRatings = async (req, res) => {
  try {
    const { blogId } = req.params;

    const ratings = await prisma.blogRating.findMany({
      where: { blogId },
      include: { user: { select: { id: true, username: true } } },
    });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};
