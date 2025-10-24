import { Box, Avatar, Typography, Button, Stack } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useState } from "react";

interface AuthorProfileProps {
  username: string;
  displayName: string;
  avatarUrl: string;
  followers: number;
  following: number;
  isCurrentUser: boolean;
}

export default function AuthorProfile({
  username,
  displayName,
  avatarUrl,
  followers,
  following,
  isCurrentUser,
}: AuthorProfileProps) {
  // ✅ State lưu trạng thái follow
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <Box
      sx={{
        bgcolor: "#121212",
        color: "white",
        borderRadius: 2,
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Ảnh đại diện */}
      <Avatar
        src={avatarUrl}
        sx={{ width: 120, height: 120, mb: 2, border: "2px solid gray" }}
      />

      {/* Tên hiển thị và username */}
      <Typography variant="h5" fontWeight={700}>
        {displayName}
      </Typography>
      <Typography color="gray" mb={2}>
        @{username}
      </Typography>

      {/* Nút hành động */}
      {isCurrentUser ? (
        <Button
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "gray",
            "&:hover": { borderColor: "white" },
            mb: 2,
          }}
        >
          Edit Profile
        </Button>
      ) : (
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant={isFollowing ? "outlined" : "contained"}
            onClick={handleFollowToggle}
            sx={{
              bgcolor: isFollowing ? "transparent" : "#1db954",
              color: isFollowing ? "white" : "black",
              borderColor: "gray",
              "&:hover": {
                bgcolor: isFollowing ? "#222" : "#1ed760",
              },
              minWidth: 100,
            }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<ChatBubbleOutlineIcon />}
            sx={{
              color: "white",
              borderColor: "gray",
              "&:hover": { borderColor: "white" },
            }}
          >
            Message
          </Button>
        </Stack>
      )}

      {/* Thống kê */}
      <Stack direction="row" spacing={4}>
        <Box>
          <Typography fontWeight={600}>
            {followers + (isFollowing ? 1 : 0)}
          </Typography>
          <Typography color="gray" variant="body2">
            followers
          </Typography>
        </Box>
        <Box>
          <Typography fontWeight={600}>{following}</Typography>
          <Typography color="gray" variant="body2">
            following
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
