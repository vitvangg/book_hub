import { Box, Stack, IconButton, Avatar, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useSelector } from "react-redux";
import {  useLikePostMutation } from "../../redux/service";
import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "react-toastify";

export default function SideBar({
  post,
  onCommentClick,
}: {
  post: any;
  onCommentClick: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);

  const [likePost] = useLikePostMutation();

  const { myInfo } = useSelector((state: any) => state.service);
  const userID = myInfo?.user_id;

  const handleLikeClick = async () => {
    try {
      const res = await likePost(String(post.post_id)).unwrap();
      if (res.like) {
        setIsLiked(false);
      }
      else {
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Failed to like post");
    }
  };

  useEffect(() => {
    console.log("Post likes:", post?.likes);
    setIsLiked(post?.likes.some((like: any) => like.user_id === userID) ?? false);
  }, [post, userID]);

  return (
    <Stack
      spacing={3}
      alignItems="center"
      sx={{ width: "80px", maxWidth: "80px" }}
    >
      {/* Like */}
    <Box textAlign="center">
      <IconButton
        sx={{
          color: isLiked ? "#e91e63" : "#757575",
          "&:hover": { color: "#e91e63" },
        }}
        onClick={handleLikeClick}
      >
        {isLiked ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
      </IconButton>
      <Typography variant="body2" fontWeight={600}>
        {post?.likes.length || 0}
      </Typography>
    </Box>

      {/* Avatar + Follow */}
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar
          src={post?.user.avatar}
          sx={{
            width: 48,
            height: 48,
            border: "3px dashed #cfd8dc",
            p: "3px",
          }}
        />
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            bottom: -4,
            left: "50%",
            transform: "translateX(-50%) translateY(20%)",
            bgcolor: "white",
            border: "1px solid #e0e0e0",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <PersonAddAltIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Comment */}
      <Box textAlign="center">
        <IconButton
          onClick={onCommentClick}
          sx={{
            color: "#757575",
            "&:hover": { color: "#2196f3" },
          }}
        >
          <ChatBubbleOutlineIcon fontSize="large" />
        </IconButton>
        <Typography variant="body2" fontWeight={600}>
          {post?.comments.length || 0}
        </Typography>
      </Box>
    </Stack>
  );
}
