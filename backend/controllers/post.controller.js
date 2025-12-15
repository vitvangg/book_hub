import prisma from "../config/db.js";
import formidable from "formidable";
import cloudinary from "../config/cloudinary.js";

// create a new draft post
export async function createDraftPost(req, res) {
  try {
    const userID = req.user.user_id; 
    const newPost = await prisma.post.create({
      data: {
        title: "Untitled Draft",
        quote: "",
        user_id: Number(userID),
        status: "draft"
      }
    });
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// publish a draft post
export async function publishPost(req, res) {
  try {
    const { title, quote, tagIDs } = req.body;
    if (!Array.isArray(tagIDs)) {
      return res.status(400).json({ message: "tagIDs must be an array" });
    }
    const { postID } = req.params;
    const userID = req.user.user_id;

    const post = await prisma.post.findUnique({
      where: { post_id: Number(postID) },
    }); 
    if (post.user_id !== userID) {
      return res.status(403).json({ message: "Unauthorized to publish this post" });
    }
    const publishedPost = await prisma.post.update({
      where: { post_id: Number(postID) },
      data: {
        title,
        quote,
        status: "published",
        post_tags: {
            create: tagIDs.map(id => ({
                tag: { connect: { tag_id: Number(id) } }
            }))
        },
      },
      include: {
        post_tags: {
            include: {
                tag: { select: { name: true } },
            },
        },
      }
    });
    res.status(200).json({ message: "Post published successfully", post: publishedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// update a published post
export async function updatePublishedPost(req, res) {
  try {
    const { postID } = req.params;
    const { title, quote, tagIDs } = req.body;
    // Xóa hết tag cũ
    await prisma.postTag.deleteMany({
      where: { post_id: Number(postID) },
    });
    const updatedPost = await prisma.post.update({
        where: { post_id: Number(postID) },
        data: { title, quote, post_tags: {
            create: tagIDs.map(id => ({
                tag: { connect: { tag_id: Number(id) } }
            }))
        }},
        include: {
            post_tags: {
                include: {
                    tag: { select: { name: true } },
                },
            },
        }
    });
    const { post_tags, ...rest } = updatedPost;
    const formattedPost = {
        ...rest,
        tags: post_tags.map(pt => pt.tag.name),
    };
    res.status(200).json({ message: "Post updated successfully", post: formattedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } 
}

// delete a post
export async function deletePost(req, res) {
    try {
        const { postID } = req.params;
        const userID = req.user.user_id;
        const post = await prisma.post.findUnique({
            where: { post_id: Number(postID) },
        });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user_id !== userID && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }
        await prisma.post.delete({
            where: { post_id: Number(postID) },
        });
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// create a new block for a post
export async function createBlock(req, res) {
  try {
    const form = new formidable.IncomingForm();

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { postID, type } = fields;
    const userID = req.user.user_id;
    if (!postID || !type) {
      return res.status(400).json({ message: "Missing postID or type" });
    }

    const post = await prisma.post.findUnique({
      where: { post_id: Number(postID) },
    });

    if (post.user_id !== userID) {
      return res.status(403).json({ message: "Unauthorized to add block to this post" });
    }

    const validType = ["text", "quote", "image"];
    if (!validType.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type value. Must be one of: text, quote, image",
      });
    }

    let content = {};
    let blockData = {
      post_id: Number(postID),
      type,
      order_index: Number(fields.order_index) || 1,
    };

    if (type === "image") {
      const imageFile = files.file;
      if (!imageFile) {
        return res.status(400).json({ message: "Missing image file" });
      }

      const result = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: "post_blocks",
        crop: "fill",
      });

      content = {
        image: result.secure_url,
        caption: fields.caption || "",
      };
    } 
    else if (type === "text") {
      const textLevel = fields.textLevel || "normal";
      const textFormat = fields.textFormat || "normal";
      const textAlign = fields.textAlign || "left";

      const validTextLevel = ["normal", "h2", "h3"];
      const validTextFormat = ["normal", "bold", "italic", "underline"];
      const validTextAlign = ["left", "center", "right", "justify"];

      if (
        !validTextLevel.includes(textLevel) ||
        !validTextFormat.includes(textFormat) ||
        !validTextAlign.includes(textAlign)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid text style. Check textLevel, textFormat, and textAlign values.",
        });
      }

      blockData.textLevel = textLevel;
      blockData.textFormat = textFormat;
      blockData.textAlign = textAlign;
      content = { text: fields.text || "" };
    } 
    else if (type === "quote") {
      content = { quote: fields.quote || "" };
    }

    blockData.content = content;

    const newBlock = await prisma.block.create({ data: blockData });

    res.status(201).json({
      message: "Block created successfully",
      block: newBlock,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// delete a block
export async function deleteBlock(req, res) {
    try {
        const { blockID } = req.params;
        const userID = req.user.user_id;

        if (!blockID) {
            return res.status(404).json({ message: "Block not found" });
        }
        const block = await prisma.block.findUnique({
            where: { block_id: Number(blockID) },
        });
        if (!block) {
            return res.status(404).json({ message: "Block not found" });
        }
        const post = await prisma.post.findUnique({
            where: { post_id: block.post_id },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user_id !== userID) {
            return res.status(403).json({ message: "Unauthorized to delete this block" });
        }

        await prisma.block.delete({
            where: { block_id: Number(blockID) },
        });
        res.status(200).json({ message: "Block deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    } 
}

// delete list of blocks by post ID
export async function deleteBlocksByPost(req, res) {
    try {
        const { postID } = req.params;
        const userID = req.user.user_id;

        if (!postID) {
            return res.status(404).json({ message: "Post not found" });
        }

        const post = await prisma.post.findUnique({
            where: { post_id: Number(postID), status: "draft" },
        });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user_id !== userID) {
            return res.status(403).json({ message: "Unauthorized to delete blocks from this post" });
        }

        await prisma.block.deleteMany({
            where: { post_id: Number(postID) },
        });

        res.status(200).json({ message: "Blocks deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// update a block
export async function updateBlock(req, res) {
  try {
    const form = new formidable.IncomingForm();

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { blockID } = req.params;
    const { type } = fields;

    const validType = ["text", "quote", "image"];
    if (type && !validType.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type value. Must be one of: text, quote, image",
      });
    }

    const existingBlock = await prisma.block.findUnique({
      where: { block_id: Number(blockID) },
    });

    if (!existingBlock) {
      return res.status(404).json({ message: "Block not found" });
    }

    const oldContent = existingBlock.content || {};
    const finalType = type || existingBlock.type;
    let content = {};

    if (finalType === "image") {
      const imageFile = files.file;
      existingBlock.textAlign = null;
      existingBlock.textFormat = null;
      existingBlock.textLevel = null;
      content = {};
      if (imageFile) {
        const result = await cloudinary.uploader.upload(imageFile.filepath, {
          folder: "post_blocks",
          crop: "fill",
        });
        content.image = result.secure_url;
      } else {
        content.image = oldContent.image;
      }
      content.caption = fields.caption || oldContent.caption || "";
    } 
    else if (finalType === "text") {
      const textLevel = fields.textLevel || existingBlock.textLevel || "normal";
      const textFormat = fields.textFormat || existingBlock.textFormat || "normal";
      const textAlign = fields.textAlign || existingBlock.textAlign || "left";
      content = {};
      content = { text: fields.text || oldContent.text || "" };
      if (!content.text) {
        return res.status(400).json({ message: "Text content cannot be empty" });
      }
      await prisma.block.update({
        where: { block_id: Number(blockID) },
        data: {
          type: finalType,
          content,
          order_index: Number(fields.order_index) || existingBlock.order_index,
          textLevel,
          textFormat,
          textAlign,
        },
      });
      return res.status(200).json({ message: "Block updated successfully" });
    } 
    else if (finalType === "quote") {
      existingBlock.textAlign = null;
      existingBlock.textFormat = null;
      existingBlock.textLevel = null;
      content = {};
      content = { quote: fields.quote || oldContent.quote };
      if (!content.quote) {
        return res.status(400).json({ message: "Quote content cannot be empty" });
      }
    }

    const orderIndex = Number(fields.order_index) || existingBlock.order_index;

    const updatedBlock = await prisma.block.update({
      where: { block_id: Number(blockID) },
      data: {
        type: finalType,
        content,
        order_index: orderIndex,
      },
    });

    res.status(200).json({
      message: "Block updated successfully",
      block: updatedBlock,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// get a post by ID
export async function getPost(req, res) {
  try {
    const { postID } = req.params;

    const post = await prisma.post.findUnique({
      where: { post_id: Number(postID), status: "published" },
      include: {
        blocks: { orderBy: { order_index: "asc" } },
        user: { select: { name: true, avatar: true, user_id: true } },
        post_tags: {
          include: { tag: { select: { tag_id: true, name: true } } },
        },
        likes: {
          include: { user: { select: { name: true} } },
        },
        comments: {
          include: { user: { select: { name: true } } },
        }
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Tạo bản sao post và loại bỏ post_tags
    const { post_tags, ...rest } = post;

    const formattedPost = {
      ...rest,
      tags: post_tags.map(pt => pt.tag),
    };

    res.status(200).json({ post: formattedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function listBlockByPost(req, res) {
    try {
        const { postID } = req.params;
        const blocks = await prisma.block.findMany({
            where: { post_id: Number(postID) },
            orderBy: { order_index: 'asc' },
        });
        res.status(200).json({ blocks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// search posts by user name
export async function searchPost(req, res) {
  try {
    const { q, page } = req.query;
    const limit = 10;
    const page_int = parseInt(page, 10) || 1;
    const offset = (page_int - 1) * limit;
    const pattern = q.trim();

    const posts = await prisma.$queryRaw`
      SELECT p.post_id, u.user_id, u.name, u.avatar, p.title, p.quote, p."createdAt",
      CAST(COUNT(l.user_id) AS INTEGER) AS like_count,
      CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
      FROM "post" p
      JOIN "user" u ON p.user_id = u.user_id
      LEFT JOIN "like" l ON p.post_id = l.post_id
      LEFT JOIN "comment" c ON p.post_id = c.post_id
      WHERE p.status = 'published' AND c.parent_id IS NULL AND p.title ILIKE ${'%' + pattern + '%'}
      GROUP BY p.post_id, u.user_id
      ORDER BY 
        CASE
          WHEN p.title ILIKE ${pattern} THEN 1
          WHEN p.title ILIKE ${pattern + '%'} THEN 2
          WHEN p.title ILIKE ${'%' + pattern + '%'} THEN 3
          ELSE 4
        END,
        p."createdAt" DESC
    `;

    const formatted = posts.map((p) => ({
      post_id: p.post_id,
      title: p.title,
      quote: p.quote,
      createdAt: p.createdAt,
      like_count: p.like_count,
      comment_count: p.comment_count,
      user: {
        user_id: p.user_id,
        name: p.name,
        avatar: p.avatar,
      },
    }));

    // resolve block image
    const fullformat = await Promise.all(
      formatted.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: { post_id: post.post_id, type: "image" },
          orderBy: { order_index: 'asc' }
        });

        return {
          ...post,
          image_url: block?.content?.image ?? null,
        };
      })
    );

    // Pagination
    const pagedPosts = fullformat.slice(offset, offset + limit);
    const totalPages = Math.ceil(formatted.length / limit);

    res.status(200).json({
      success: true,
      message: "Search posts fetched successfully",
      data: pagedPosts,
      totalPages,
    });
  } catch (error) {
    console.error("Error search posts: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}



// list published posts with pagination
export async function listPostsByUser(req, res) {
    try {
        const { userID } = req.params;
        const user = await prisma.user.findUnique({
            where: { user_id: Number(userID) },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { page } = req.query;
        const limit = 10;
        const page_int = parseInt(page, 10) || 1;
        const offset = (page_int - 1) * limit;

        // Đếm tổng số bài của user (không phân trang)
        const totalPosts = await prisma.post.count({
          where: { status: "published", user_id: Number(userID) },
        });
        // Tính tổng số trang
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await prisma.post.findMany({
            where: { status: "published", user_id: Number(userID) },
            include: {
                user: {
                    select: {
                        name: true,
                        avatar: true
                    }
                },
                post_tags: {
                    include: {
                        tag: true,
                    },
                },
                _count: {
                    select: { likes: true, comments: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: offset,   
            take: limit,
        });
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: {
            post_id: post.post_id,
            type: "image",
          },
          orderBy: { order_index: "asc" },
        });

        const first_image = block?.content?.image ?? null;

        return {
          ...post,
          tags: post.post_tags.map((pt) => pt.tag.name),
          image_url: first_image,
        };
      })
    );
    res.status(200).json({ posts: formattedPosts, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// like or unlike a post
export async function likePost(req, res) {
    try {
        const { postID } = req.params;
        const userID = req.user.user_id;
        const post = await prisma.post.findUnique({
            where: { post_id: Number(postID) },
        });
        if (userID === post.user_id) {
            return res.status(400).json({ message: "Cannot like your own post" });
        }
        if (req.user.role === 'admin') {
            return res.status(403).json({ message: "Admins cannot like posts" });
        }
        const existingLike = await prisma.like.findUnique({
            where: {
                unique_like: {
                    post_id: Number(postID),
                    user_id: Number(userID),
                }
            },
        });
        if (existingLike) {
            await prisma.like.delete({
                where: {
                    unique_like: {
                        post_id: Number(postID),
                        user_id: Number(userID),
                    }
                },
            });
            return res.status(200).json({ message: "Post unliked successfully" });
        } else {
            const newLike = await prisma.like.create({
                data: {
                    post_id: Number(postID),
                    user_id: Number(userID),
                },
            });
            return res.status(201).json({ message: "Post liked successfully", like: newLike });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Tag management
export async function createTag(req, res) {
    try {
        const { name } = req.body;
        const existingTag = await prisma.tag.findUnique({
            where: { name },
        });
        if (existingTag) {
            return res.status(400).json({ message: "Tag already exists" });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden" });
        }
        const newTag = await prisma.tag.create({
            data: { name },
        });
        res.status(201).json({ message: "Tag created successfully", tag: newTag });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
// delete a tag
export async function deleteTag(req, res) {
  try {
      const { tagID } = req.params;
      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: "Forbidden" });
      }
      await prisma.tag.delete({
          where: { tag_id: Number(tagID) },
      });
      res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
}

// list all tags
export async function listTags(req, res) {
    try {
        const tags = await prisma.tag.findMany();
        res.status(200).json({ tags });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// add a tag to a post
export async function addTagToPost(req, res) {
    try {
        const { postID, tagID } = req.body;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden" });
        }
        const newPostTag = await prisma.postTag.create({
            data: {
                post_id: Number(postID),  
                tag_id: Number(tagID),
            },
        });
        res.status(201).json({ message: "Tag added to post successfully", postTag: newPostTag });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// remove a tag from a post
export async function removeTagFromPost(req, res) { 
    try {
        const { postID, tagID } = req.body;
        await prisma.postTag.delete({
            where: {
                unique_post_tag: {
                    post_id: Number(postID),
                    tag_id: Number(tagID),
                },
            },
        });
        res.status(200).json({ message: "Tag removed from post successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }   
}

// Homepage 
// Bài viết mới nhất
export async function listLatestPosts(req, res) {
  try {
      const { page } = req.query;
      const limit = 10;
      const page_int = parseInt(page, 10) || 1;
      const offset = (page_int - 1) * limit;

      // Đếm tổng số bài 
      const totalPosts = await prisma.post.count({
        where: { status: "published" },
      });
      // Tính tổng số trang
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await prisma.post.findMany({
          where: { status: "published" },
          include: {
              user: {
                  select: {
                      name: true,
                      avatar: true
                  }
              },
              post_tags: {
                  include: {
                      tag: true,
                  },
              },
              _count: {
                  select: { likes: true, comments: true }
              }
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,   
          take: limit,
      });
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: {
            post_id: post.post_id,
            type: "image",
          },
          orderBy: { order_index: "asc" },
        });

        const first_image = block?.content?.image ?? null;

        return {
          ...post,
          tags: post.post_tags.map((pt) => pt.tag.name),
          image_url: first_image,
        };
      })
    );

      res.status(200).json({ posts: formattedPosts, totalPages });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }  
}

// Đánh giá cao nhất
export async function listTopRatedPosts(req, res) {
  try {
      const { page } = req.query;
      const limit = 10;
      const page_int = parseInt(page, 10) || 1;
      const offset = (page_int - 1) * limit;

      // Đếm tổng số bài
      const totalPosts = await prisma.post.count({
        where: { status: "published" },
      });
      // Tính tổng số trang
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await prisma.post.findMany({
          where: { status: "published" },
          include: {
              user: {
                  select: {
                      name: true,
                      avatar: true
                  }
              },
              post_tags: {
                  include: {
                      tag: true,
                  },
              },
              _count: {
                  select: { likes: true, comments: true }
              }
          },
          orderBy: [{
            likes: { _count: "desc" },
            },
          {
            createdAt: 'desc'
          }],
          skip: offset,
          take: limit,
      });
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: {
            post_id: post.post_id,
            type: "image",
          },
          orderBy: { order_index: "asc" },
        });

        const first_image = block?.content?.image ?? null;

        return {
          ...post,
          tags: post.post_tags.map((pt) => pt.tag.name),
          image_url: first_image,
        };
      })
    );

      res.status(200).json({ posts: formattedPosts, totalPages });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }  
}

// Bài viết từ những người dùng đang theo dõi
export async function listPostsByFollowing(req, res) {
  try {
      const { page } = req.query;
      const limit = 10;
      const page_int = parseInt(page, 10) || 1;
      const offset = (page_int - 1) * limit;

      const userID = req.user.user_id;
      // Lấy danh sách user mà người dùng hiện tại đang theo dõi
      const followingUsers = await prisma.follow.findMany({
          where: {
              following_id: userID
          },
          include: {
            followed: {
              select: {
                user_id: true
              }
            }
          }
      });
      const listFollowingUser = followingUsers.map(follow => follow.followed.user_id);
      // Đếm tổng số bài
      const totalPosts = await prisma.post.count({
        where: { status: "published" },
      });
      // Tính tổng số trang
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await prisma.post.findMany({
          where: { status: "published", user_id: { in: listFollowingUser } },
          include: {
              user: {
                  select: {
                      name: true,
                      avatar: true
                  }
              },
              post_tags: {
                  include: {
                      tag: true,
                  },
              },
              _count: {
                  select: { likes: true, comments: true }
              }
          },
          orderBy: 
          {
            createdAt: 'desc'
          },
          skip: offset,
          take: limit,
      });
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: {
            post_id: post.post_id,
            type: "image",
          },
          orderBy: { order_index: "asc" },
        });

        const first_image = block?.content?.image ?? null;

        return {
          ...post,
          tags: post.post_tags.map((pt) => pt.tag.name),
          image_url: first_image,
        };
      })
    );

      res.status(200).json({ posts: formattedPosts, totalPages });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }  
}

// Bài viết sôi nổi
export async function listPostsHot(req, res) {
  try {
      const { page } = req.query;
      const limit = 10;
      const page_int = parseInt(page, 10) || 1;
      const offset = (page_int - 1) * limit;

      // Đếm tổng số bài
      const totalPosts = await prisma.post.count({
        where: { status: "published" },
      });
      // Tính tổng số trang
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await prisma.post.findMany({
          where: { status: "published" },
          include: {
              user: {
                  select: {
                      name: true,
                      avatar: true
                  }
              },
              post_tags: {
                  include: {
                      tag: true,
                  },
              },
              _count: {
                  select: { likes: true, comments: true }
              }
          },
      });

      const now = new Date();
      const decay = 0.2;

      // Tính score cho từng post
      const postsWithScore = posts.map(post => {
      const hoursSincePosted = (now.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60);
      const score = post._count.likes * 1
                  + post._count.comments * 3
                  - hoursSincePosted * decay;
      return { ...post, score };
    });

    // Sắp xếp theo score giảm dần
    postsWithScore.sort((a, b) => b.score - a.score);

    // Pagination
    const pagedPosts = postsWithScore.slice(offset, offset + limit);
    const formattedPosts = await Promise.all(
      pagedPosts.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: {
            post_id: post.post_id,
            type: "image",
          },
          orderBy: { order_index: "asc" },
        });

        const first_image = block?.content?.image ?? null;

        return {
          ...post,
          tags: post.post_tags.map((pt) => pt.tag.name),
          image_url: first_image,
        };
      })
    );

      res.status(200).json({ posts: formattedPosts, totalPages });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }  
}

// Bài viết sôi nổi trong 30 ngay qua
export async function listTrending30(req, res) {
  try {
      const page = 1;
      const limit = 10;
      const page_int = parseInt(page, 10) || 1;
      const offset = (page_int - 1) * limit;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // 30 ngày trước

      const posts = await prisma.post.findMany({
          where: { status: "published", createdAt: { gte: thirtyDaysAgo } },
          include: {
              user: {
                  select: {
                      name: true,
                      avatar: true
                  }
              },
              post_tags: {
                  include: {
                      tag: true,
                  },
              },
              _count: {
                  select: { likes: true, comments: true }
              }
          },
      });

      const now = new Date();
      const decay = 0.2;

      // Tính score cho từng post
      const postsWithScore = posts.map(post => {
      const hoursSincePosted = (now.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60);
      const score = post._count.likes * 1
                  + post._count.comments * 3
                  - hoursSincePosted * decay;
      return { ...post, score };
    });

    // Sắp xếp theo score giảm dần
    postsWithScore.sort((a, b) => b.score - a.score);

    // Pagination
    const pagedPosts = postsWithScore.slice(offset, offset + limit);
    const formattedPosts = await Promise.all(
      pagedPosts.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: {
            post_id: post.post_id,
            type: "image",
          },
          orderBy: { order_index: "asc" },
        });

        const first_image = block?.content?.image ?? null;

        return {
          ...post,
          tags: post.post_tags.map((pt) => pt.tag.name),
          image_url: first_image,
        };
      })
    );

      res.status(200).json({ posts: formattedPosts });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }  
}


// Posts by Tag
// filter posts by tag - latest
export async function listLatestPostsByTag(req, res) {
  try {
      const { page } = req.query;
      const { tagID } = req.params;
      const limit = 10;
      const page_int = parseInt(page, 10) || 1;
      const offset = (page_int - 1) * limit;

      // Đếm tổng số bài 
      const totalPosts = await prisma.post.count({
        where: { status: "published", post_tags: { some: { tag: { tag_id: Number(tagID) } } } },
      });
      // Tính tổng số trang
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await prisma.post.findMany({
          where: { status: "published", post_tags: { some: { tag: { tag_id: Number(tagID) } } } },
          include: {
              user: {
                  select: {
                      name: true,
                      avatar: true
                  }
              },
              post_tags: {
                  include: {
                      tag: true,
                  },
              },
              _count: {
                  select: { likes: true, comments: true }
              }
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,   
          take: limit,
      });
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: {
            post_id: post.post_id,
            type: "image",
          },
          orderBy: { order_index: "asc" },
        });

        const first_image = block?.content?.image ?? null;

        return {
          ...post,
          tags: post.post_tags.map((pt) => pt.tag.name),
          image_url: first_image,
        };
      })
    );

      res.status(200).json({ posts: formattedPosts, totalPages });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }  
}

// filter posts by tag - hot
export async function listPostsHotByTag(req, res) {
  try {
      const { page } = req.query;
      const { tagID } = req.params;
      const limit = 10;
      const page_int = parseInt(page, 10) || 1;
      const offset = (page_int - 1) * limit;

      // Đếm tổng số bài
      const totalPosts = await prisma.post.count({
        where: { status: "published", post_tags: { some: { tag: { tag_id: Number(tagID) } } } },
      });
      // Tính tổng số trang
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await prisma.post.findMany({
          where: { status: "published", post_tags: { some: { tag: { tag_id: Number(tagID) } } } },
          include: {
              user: {
                  select: {
                      name: true,
                      avatar: true
                  }
              },
              post_tags: {
                  include: {
                      tag: true,
                  },
              },
              _count: {
                  select: { likes: true, comments: true }
              }
          },
      });

      const now = new Date();
      const decay = 0.2;

      // Tính score cho từng post
      const postsWithScore = posts.map(post => {
      const hoursSincePosted = (now.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60);
      const score = post._count.likes * 1
                  + post._count.comments * 3
                  - hoursSincePosted * decay;
      return { ...post, score };
    });

    // Sắp xếp theo score giảm dần
    postsWithScore.sort((a, b) => b.score - a.score);

    // Pagination
    const pagedPosts = postsWithScore.slice(offset, offset + limit);
    const formattedPosts = await Promise.all(
      pagedPosts.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: {
            post_id: post.post_id,
            type: "image",
          },
          orderBy: { order_index: "asc" },
        });

        const first_image = block?.content?.image ?? null;

        return {
          ...post,
          tags: post.post_tags.map((pt) => pt.tag.name),
          image_url: first_image,
        };
      })
    );

      res.status(200).json({ posts: formattedPosts, totalPages });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
}

// filter posts by tag - top rated
export async function listPostsTopRatedByTag(req, res) {
  try {
      const { page } = req.query;
      const { tagID } = req.params;
      const limit = 10;
      const page_int = parseInt(page, 10) || 1;
      const offset = (page_int - 1) * limit;

      // Đếm tổng số bài
      const totalPosts = await prisma.post.count({
        where: { status: "published", post_tags: { some: { tag: { tag_id: Number(tagID) } } } },
      });
      // Tính tổng số trang
      const totalPages = Math.ceil(totalPosts / limit);

      const posts = await prisma.post.findMany({
          where: { status: "published", post_tags: { some: { tag: { tag_id: Number(tagID) } } } },
          include: {
              user: {
                  select: {
                      name: true,
                      avatar: true
                  }
              },
              post_tags: {
                  include: {
                      tag: true,
                  },
              },
              _count: {
                  select: { likes: true, comments: true }
              }
          },
      });

      // Sắp xếp theo số lượng likes và comments
      posts.sort((a, b) => {
          const aScore = a._count.likes + a._count.comments * 3;
          const bScore = b._count.likes + b._count.comments * 3;
          return bScore - aScore;
      });

      // Pagination
      const pagedPosts = posts.slice(offset, offset + limit);
    const formattedPosts = await Promise.all(
      pagedPosts.map(async (post) => {
        const block = await prisma.block.findFirst({
          where: {
            post_id: post.post_id,
            type: "image",
          },
          orderBy: { order_index: "asc" },
        });

        const first_image = block?.content?.image ?? null;

        return {
          ...post,
          tags: post.post_tags.map((pt) => pt.tag.name),
          image_url: first_image,
        };
      })
    );

      res.status(200).json({ posts: formattedPosts, totalPages });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
}
