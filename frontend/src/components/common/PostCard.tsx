import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Tooltip
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

interface PostCardProps {
  image: string;
  title: string;
  description: string;
  author: string;
  time: string;
  readTime: string;
  likes: number;
  comments: number;
  layout?: "row" | "column";
}

export default function PostCard({
  image,
  title,
  description,
  author,
  time,
  readTime,
  likes,
  comments,
  layout = "row",
}: PostCardProps) {
  return (
    <Tooltip title={title} arrow>
      <Card
        sx={{
          display: "flex",
          flexDirection:
            layout === "column" ? "column" : { xs: "column", md: "row" },
          width: layout === "column" ? 280 : "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
          bgcolor: "background.paper",
        "&:hover": {
          bgcolor: "#535353",
          cursor: "pointer",
        },
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          width: layout === "column" ? "100%" : { xs: "100%", md: 280 },
          height: layout === "column" ? 160 : { xs: 180, md: "100%" },
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      <CardContent
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          KHOA HỌC - CÔNG NGHỆ • {readTime}
        </Typography>

        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            mb: 1,
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar src="/avatar.jpg" sx={{ width: 24, height: 24 }} />
            <Typography variant="body2" fontWeight={500}>
              {author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {time}
            </Typography>
          </Stack>

          {/* ❤️ Like & 💬 Comment */}
          { layout === "row" && (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <FavoriteBorderIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {likes}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {comments}
              </Typography>
            </Stack>
          </Stack>
          ) }
        </Stack>
      </CardContent>
    </Card>
    </Tooltip>
  );
}
