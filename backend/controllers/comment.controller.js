import prisma from "../config/db.js";

// 🟢 Tạo comment mới (comment cha)
export const createComment = async (req, res) => {
  try {
    const { postID, content } = req.body;
    const userID = req.user.user_id;
    
    if (req.user.role === 'admin') {
      return res.status(403).json({ error: "Admins cannot create comments" });
    }
    const newComment = await prisma.comment.create({
      data: {
        post_id: Number(postID),
        user_id: Number(userID),
        content,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🟢 Xóa comment (chỉ người tạo mới được xóa)
export const deleteComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const userID = req.user.user_id;

    const comment = await prisma.comment.findUnique({
      where: { comment_id: Number(commentID) },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user_id !== userID && req.user.role !== 'admin') {
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }

    await prisma.comment.delete({
      where: { comment_id: Number(commentID) },
    });

    res.status(204).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🟢 Cập nhật nội dung comment
export const updateComment = async (req, res) => {
  try {
    const commentID = req.params.commentID;
    const { content } = req.body;
    const userID = req.user.user_id;
    const comment = await prisma.comment.findUnique({
      where: { comment_id: Number(commentID) },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.user_id !== userID) {
      return res.status(403).json({ error: "You are not authorized to update this comment" });
    }

    const updatedComment = await prisma.comment.update({
      where: { comment_id: Number(commentID) },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🟢 Lấy danh sách comment theo post
export const listCommentsByPost = async (req, res) => {
  try {
    const { postID } = req.params;
    const limit = parseInt(req.query.limit) || 5; // số comment cha
    const skip = parseInt(req.query.skip) || 0;
    const replyLimit = parseInt(req.query.replyLimit) || 2; // số reply mỗi comment

    const comments = await prisma.comment.findMany({
      where: {
        post_id: Number(postID),
        parent_id: null,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: true,
        replies: {
          take: replyLimit,
          orderBy: { createdAt: "asc" },
          include: { user: true },
        },
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error listing comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🟢 Trả lời comment (reply)
export const replyToComment = async (req, res) => {
  try {
    const { postID, content } = req.body;
    const userID = req.user.user_id;
    const { commentID } = req.params;

    const newReply = await prisma.comment.create({
      data: {
        post_id: Number(postID),
        user_id: Number(userID),
        parent_id: Number(commentID),
        content,
      },
    });

    res.status(201).json(newReply);
  } catch (error) {
    console.error("Error replying to comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
