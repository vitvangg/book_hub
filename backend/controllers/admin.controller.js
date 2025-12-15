import prisma from "../config/db.js";

// dashboard admin
export const getOverview = async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count({
      where: { status: 'published' }
    });
    const commentCount = await prisma.comment.count();

    const data = {
        userCount,
        postCount,
        commentCount,
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getNewPost24h = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const postCount = await prisma.post.count({
      where: {
        createdAt: {
          gte: since,
        },
      },
    });
    res.status(200).json({ postCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getNewUser24h = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const userCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: since,
        },
      },
    });
    res.status(200).json({ userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getNewComment24h = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const commentCount = await prisma.comment.count({
      where: {
        createdAt: {
          gte: since,
        },
      },
    });
    res.status(200).json({ commentCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};