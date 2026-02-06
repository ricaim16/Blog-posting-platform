import prisma from "../config/db.js";

/* ======================
   LIKE OR UNLIKE BLOG (TOGGLE)
====================== */
export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;

    // check if blog exists
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // check if user already liked
    const existingLike = await prisma.like.findUnique({
      where: { userId_blogId: { userId: req.user.id, blogId } },
    });

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: { userId_blogId: { userId: req.user.id, blogId } },
      });
      return res.status(200).json({ message: "Blog unliked" });
    }

    // like
    const like = await prisma.like.create({
      data: {
        userId: req.user.id,
        blogId,
      },
    });

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

/* ======================
   GET LIKES FOR A BLOG (PUBLIC)
====================== */
export const getBlogLikes = async (req, res) => {
  try {
    const { blogId } = req.params;

    const likes = await prisma.like.findMany({
      where: { blogId },
      include: {
        user: { select: { id: true, username: true, profilePicture: true } },
      },
    });

    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch likes" });
  }
};
