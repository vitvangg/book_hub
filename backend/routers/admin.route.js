import express from "express";
import { auth } from "../middleware/auth.js";

import { getOverview, getNewPost24h, getNewUser24h, getNewComment24h } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/overview", auth, getOverview);
router.get("/posts/new-24h", auth, getNewPost24h);
router.get("/users/new-24h", auth, getNewUser24h);
router.get("/comments/new-24h", auth, getNewComment24h);

export default router;
