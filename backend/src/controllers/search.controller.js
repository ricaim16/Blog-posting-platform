import prisma from "../config/db.js";

/* ======================
   SEARCH USERS BY NAME OR USERNAME
====================== */
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query; // search query
    if (!q)
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, username: true, name: true, profilePicture: true },
      take: 20, // optional: limit results
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to search users" });
  }
};

/* ======================
   SEARCH BLOGS BY TITLE, CONTENT OR TAGS
====================== */
export const searchBlogs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });

    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { tags: { has: q } }, // tags is a string array
        ],
      },
      include: {
        author: { select: { id: true, username: true, profilePicture: true } },
        _count: { select: { comments: true, likes: true, ratings: true } },
      },
      take: 20, // optional
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to search blogs" });
  }
};
