import prisma from "../config/db.js";

// Toggle follow/unfollow
export const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params; // target user

    if (userId === req.user.id)
      return res.status(400).json({ message: "You cannot follow yourself" });

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId: userId,
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: req.user.id,
            followingId: userId,
          },
        },
      });
      return res.status(200).json({ message: "Unfollowed user" });
    }

    const follow = await prisma.follow.create({
      data: { followerId: req.user.id, followingId: userId },
    });

    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle follow" });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, username: true, profilePicture: true },
        },
      },
    });
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch followers" });
  }
};

// Get following of a user
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, username: true, profilePicture: true },
        },
      },
    });
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch following" });
  }
};
