import express from "express";
import { auth } from "../middleware/auth.js";
import { 
  createDraftPost, 
  updatePublishedPost, 
  deletePost, 
  getPost, 
  searchPost, 
  listPostsByUser, 
  likePost, 
  createTag, 
  listTags,
  deleteTag,
  publishPost,
  createBlock,
  updateBlock,
  deleteBlock,
  listBlockByPost,
  deleteBlocksByPost,
  listLatestPosts,
  listTopRatedPosts,
  listPostsByFollowing,
  listPostsHot,
  listTrending30,
  listLatestPostsByTag,
  listPostsHotByTag,
  listPostsTopRatedByTag
} from "../controllers/post.controller.js";

const router = express.Router();

// === POST MANAGEMENT ===
router.post('/creating-post', auth, createDraftPost);
router.put('/update-post/:postID', auth, updatePublishedPost);
router.delete('/delete-post/:postID', auth, deletePost);
router.get('/post/:postID', getPost);

// Publish post (convert draft to published)
router.patch('/created-post/:postID', auth, publishPost);

// === SEARCH & LIST ===
router.get('/search-posts', searchPost);
router.get('/list-posts-by-user/:userID', listPostsByUser);

// === INTERACTIONS ===
router.post('/like-post/:postID', auth, likePost);

// === BLOCK MANAGEMENT ===
router.post('/create-block', auth, createBlock);
router.put('/update-block/:blockID', auth, updateBlock);
router.delete('/delete-block/:blockID', auth, deleteBlock);
router.get('/list-block/:postID', auth, listBlockByPost);
router.delete('/delete-list-block/:postID', auth, deleteBlocksByPost);

// === TAG MANAGEMENT ===
router.post('/create-tag', auth, createTag);
router.delete('/delete-tag/:tagID', auth, deleteTag)
router.get('/list-tags', listTags);

// === HOMEPAGE ===
router.get('/latest-posts', listLatestPosts);
router.get('/top-rated-posts', listTopRatedPosts);
router.get('/following-posts', auth, listPostsByFollowing);
router.get('/hot-posts', auth, listPostsHot);
router.get('/trending-30days', listTrending30);

// === TAG-POST ASSOCIATION ===
router.get('/latest-posts-by-tag/:tagID', listLatestPostsByTag);
router.get('/hot-posts-by-tag/:tagID', listPostsHotByTag);
router.get('/top-rated-posts-by-tag/:tagID', listPostsTopRatedByTag);

export default router;