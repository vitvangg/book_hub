import express from "express";
import { auth } from "../middleware/auth.js";
import { signUp, logIn, logOut, updateUserProfile, getUser, followUser, listUsers, deleteUser, searchUsers, getMyInfo, checkFollow
, submitFeedback, listFeedbacks, getFeedback } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/log-in', logIn);
router.post('/log-out', logOut);
router.get('/me', auth, getMyInfo);
router.put('/update-profile',auth, updateUserProfile);
router.get('/user/:userID', auth, getUser);
router.post('/follow/:userFollowedID', auth, followUser);
router.get('/list-users', auth, listUsers);
router.delete('/delete-account/:userID', auth, deleteUser);
router.get('/search-users', auth, searchUsers);
router.get('/check-follow/:userFollowedID', auth, checkFollow);

// feedback routes
router.post('/feedback', auth, submitFeedback);
router.get('/feedbacks', auth, listFeedbacks);
router.get('/feedback/:feedbackID', auth, getFeedback);

export default router;