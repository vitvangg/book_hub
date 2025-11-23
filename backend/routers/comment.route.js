import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createComment,
  updateComment,
  deleteComment,
  listCommentsByPost,
  replyToComment
} from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create-comment', auth, createComment);
router.delete('/delete-comment/:commentID', auth, deleteComment);
router.put('/update-comment/:commentID', auth, updateComment);
router.get('/list-comments/:postID', auth, listCommentsByPost);
router.post('/reply-comment/:commentID', auth, replyToComment);

export default router;
