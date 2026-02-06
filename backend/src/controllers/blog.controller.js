import prisma from "../config/db.js";

/* ======================
   CREATE BLOG (AUTH)
====================== */
export const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        tags: tags || [],
        authorId: req.user.id,
      },
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog" });
  }
};

/* ======================
   READ ALL BLOGS (PUBLIC)
====================== */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            ratings: true,
          },
        },
      },
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

/* ======================
   READ SINGLE BLOG (PUBLIC)
====================== */
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
        ratings: true,
        likes: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

/* ======================
   UPDATE BLOG (OWNER ONLY)
====================== */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.authorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: title ?? blog.title,
        content: content ?? blog.content,
        tags: tags ?? blog.tags,
      },
    });

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog" });
  }
};

/* ======================
   DELETE BLOG (OWNER ONLY)
====================== */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.authorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.blog.delete({ where: { id } });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog" });
  }
};
