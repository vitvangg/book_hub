import { Box, Stack, IconButton, Avatar, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

export default function SideBar({
  onCommentClick,
}: {
  onCommentClick: () => void;
}) {
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
            color: "#757575",
            "&:hover": { color: "#e91e63" },
          }}
        >
          <FavoriteBorderIcon fontSize="large" />
        </IconButton>
        <Typography variant="body2" fontWeight={600}>
          6
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
          src="https://i.pinimg.com/originals/1a/fb/2a/1afb2a8d7efb8e8e42025e33878d6a2a.jpg"
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
          0
        </Typography>
      </Box>
    </Stack>
  );
}
