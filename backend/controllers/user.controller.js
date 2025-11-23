import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import formidable from "formidable";

export async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    const saltRounds = 10;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { user_id: true, name: true, email: true },
    });

    // Generate JWT token
    const accessToken = jwt.sign(
      { userID: newUser.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.status(201).json({
      success: true,
      message: `User Sign in successfully! hello ${newUser.name}\nyour token is ${accessToken}`,
    });
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target.includes("email")) {
      return res.status(400).json({ success: false, message: "Email exist!" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function logIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userExist = await prisma.user.findUnique({
      where: { email: email },
      select: { user_id: true, email: true, password: true },
    });
    if (!userExist) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    } 
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid password!" });
    }
    // Generate JWT token
    const accessToken = jwt.sign(
      { userID: userExist.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Set cookie
    res.cookie("token", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({ success: true, message: "Login successful", token: accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function logOut(req, res) {
    try {
        res.cookie('token', '', {
            maxAge: 0,
            httpOnly: true,
            sameSite: "none",
            secure: true
        })
        res.status(200).json({ success: true, message: "You are logged out!" })
    } catch (error) {
        console.error("error: :", error.message);
        res.status(400).json({ success: false, message: "Internal server error" })
    }
}

export async function followUser(req, res) {
  try {
    const { userFollowedID } = req.params;
    const userFollowing = req.user; // payload JWT

    const userFollowed = await prisma.user.findUnique({
      where: { user_id: parseInt(userFollowedID) },
    });

    if (!userFollowed) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (userFollowed.user_id === userFollowing.user_id) {
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        unique_follow: {
          followed_id: userFollowed.user_id,
          following_id: userFollowing.user_id,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          unique_follow: {
            followed_id: userFollowed.user_id,
            following_id: userFollowing.user_id,
          },
        },
      });
      return res.status(200).json({ success: true, message: "Unfollowed the user." });
    } else {
      await prisma.follow.create({
        data: {
          followed_id: userFollowed.user_id,
          following_id: userFollowing.user_id,
        },
      });
      return res.status(200).json({ success: true, message: "Followed the user." });
    }
  } catch (error) {
    console.error("Error follow: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getUser(req, res) {
  try {
    const { userID } = req.params;
    const userIdNum = parseInt(userID, 10);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    const user = await prisma.user.findUnique({
      where: { user_id: userIdNum },
      select: {
        user_id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        gender: true
      },
    });
    const [followingCount, followersCount] = await Promise.all([
      prisma.follow.count({ where: { following_id: userIdNum } }),
      prisma.follow.count({ where: { followed_id: userIdNum } }),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: {...user, following_count: followingCount, followers_count: followersCount} });
  } catch (error) {
    console.error("Error get user: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getMyInfo(req, res) {
  try {
    const userID = req.user.user_id;
    const userIdNum = parseInt(userID, 10);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    const user = await prisma.user.findUnique({
      where: { user_id: userIdNum },
      select: {
        user_id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        gender: true
      },
    });
    const [followingCount, followersCount] = await Promise.all([
      prisma.follow.count({ where: { following_id: userIdNum } }),
      prisma.follow.count({ where: { followed_id: userIdNum } }),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: {...user, following_count: followingCount, followers_count: followersCount} });
  } catch (error) {
    console.error("Error get user: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export async function updateUserProfile(req, res) {
  try {
    const main_user = req.user;
    console.log("Main user:", main_user);
    const user = await prisma.user.findUnique({
      where: { user_id: main_user.user_id },
    });
    if (!main_user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const form = new formidable.IncomingForm();

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const name = fields.name || null;
    const bio = fields.bio || null;
    const gender = fields.gender || null;
    const avatarFile = files.avatar || null;

    const validGenders = ["male", "female"];
    if (gender && !validGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender value. Must be one of: male, female",
      });
    }

    // Upload avatar 
    let avatarUrl = user.avatar;
    if (avatarFile) {
      const result = await cloudinary.uploader.upload(avatarFile.filepath, {
        folder: "avatars",
        width: 150,
        height: 150,
        crop: "fill",
      });
      avatarUrl = result.secure_url;
    }

    // update user
    const updateUser = await prisma.user.update({
      where: { user_id: req.user.user_id },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(gender && { gender: gender.toLowerCase() }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updateUser,
    });
  } catch (error) {
    console.error("Error update profile: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function listUsers(req, res) {
  try {
    console.log("Query params:", req.query);
    const page  = parseInt(req.query.page, 10) || 1;
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1)  * 20,
      take: 20,
      select: {
        name: true,
        email: true,
        avatar: true
      }
    })
    res.status(200).json({ success: true, message: "List users fetched successfully", data: users });
  } catch (error) {
    console.error("Error list users: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { userID } = req.params;
    const userIdNum = parseInt(userID, 10);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    const user = await prisma.user.findUnique({
      where: { user_id: userIdNum },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await prisma.user.delete({
      where: { user_id: userIdNum },
    });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error delete user: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }   
}

export async function searchUsers(req, res) {
  try {
    const { q, page } = req.query;
    const limit = 5;
    const page_int = parseInt(req.query.page, 10) || 1;
    const offset = (page_int - 1) * limit;
    const pattern = q.trim();

    const users = await prisma.$queryRaw`
        SELECT user_id, name, email, avatar
        FROM "user"
        WHERE name ILIKE ${'%' + pattern + '%'}
        ORDER BY 
          CASE
            WHEN name ILIKE ${pattern} THEN 1
            WHEN name ILIKE ${pattern + '%'} THEN 2
            WHEN name ILIKE ${'%' + pattern + '%'} THEN 3
            ELSE 4
          END,
          "createdAt" DESC
    `;
    const formattedUsers = users.slice(offset, offset + limit);
    const totalPages = Math.ceil(users.length / limit);
    res.status(200).json({ success: true, message: "Search users fetched successfully", data: formattedUsers, totalPages });
  } catch (error) {
    console.error("Error search users: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const checkFollow = async (req, res) => {
  try {
    const { userFollowedID } = req.params;
    const userFollowing = req.user; // payload JWT

    const userFollowed = await prisma.user.findUnique({
      where: { user_id: parseInt(userFollowedID) },
    });
    if (!userFollowed) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isFollowing = await prisma.follow.findUnique({
      where: {
        unique_follow: {
          following_id: userFollowing.user_id,
          followed_id: userFollowed.user_id,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Follow status checked successfully",
      data: { isFollowing: !!isFollowing },
    });
  } catch (error) {
    console.error("Error checking follow status: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const submitFeedback = async (req, res) => {
  try {
    const user = req.user;
    const { message } = req.body;

    const feedback = await prisma.feedback.create({
      data: {
        user_id: user.user_id,
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const listFeedbacks = async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      select: {
        feedback_id: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            user_id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      message: "Feedbacks fetched successfully",
      data: feedbacks,
    });
  } catch (error) {
    console.error("Error fetching feedbacks: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getFeedback = async (req, res) => {
  try {
    const { feedbackID } = req.params;
    const feedback = await prisma.feedback.findUnique({
      where: { feedback_id: Number(feedbackID) },
      include: {
        user: {
          select: {
            user_id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.status(200).json({
      success: true,
      message: "Feedback fetched successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Error fetching feedback: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
