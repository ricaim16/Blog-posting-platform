import prisma from "../config/db.js";

/* ======================
   CREATE COMMENT (AUTH)
====================== */
export const createComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    // check if blog exists
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = await prisma.comment.create({
      data: {
        content,
        blogId,
        userId: req.user.id,
      },
      include: {
        user: { select: { id: true, username: true, profilePicture: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create comment" });
  }
};

/* ======================
   UPDATE COMMENT (OWNER ONLY)
====================== */
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params; // comment ID
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this comment" });
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update comment" });
  }
};

/* ======================
   DELETE COMMENT (OWNER ONLY)
====================== */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params; // comment ID

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await prisma.comment.delete({ where: { id } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

/* ======================
   GET ALL COMMENTS FOR A BLOG (PUBLIC)
====================== */
export const getCommentsForBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, username: true, profilePicture: true } },
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};
