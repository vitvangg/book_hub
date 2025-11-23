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
  image?: string;
  title: string;
  quote: string;
  author: any;
  time: string;
  likes: number;
  comments: number;
  tags?: string[];
  layout?: "row" | "column";
  onClick?: () => void;
}

export default function PostCard({
  image = "/meme.jpg",
  title,
  quote,
  author,
  time,
  likes,
  comments,
  tags = [],
  layout = "row",
  onClick
}: PostCardProps) {
  return (
    <Tooltip title={title} arrow onClick={onClick}>
      <Card
        sx={{
          display: "flex",
          flexDirection:
            layout === "column" ? "column" : { xs: "column", md: "row" },
          width: layout === "column" ? 280 : "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
          bgcolor: "#212121",
          maxHeight: layout === "column" ? "320px" : "180px",
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
          maxWidth: "280px",
          maxHeight: "180px",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      <CardContent
        sx={{
          flex: 1,
          color: "white",
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" sx={{ mb: 0.5 }}>
          {tags.join(" • ")}
        </Typography>

        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            height: layout === "column" ? "3em" : "auto",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>

        { layout === "row" && (
          <Typography
            variant="body2"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              mb: 1,
              textOverflow: "ellipsis",
            }}
          >
            {quote}
          </Typography>
        )}

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar src={author.avatar} sx={{ width: 24, height: 24 }} />
            <Typography variant="body2" fontWeight={500}>
              {author.name}
            </Typography>
            <Typography variant="body2">
              • {time
                  ? new Date(time).toLocaleDateString("vi-VN")
                  : "--/--/----"}
            </Typography>
          </Stack>

          {/* ❤️ Like & 💬 Comment */}
          { layout === "row" && (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <FavoriteBorderIcon sx={{ fontSize: 18, color: "white" }} />
              <Typography variant="body2">
                {likes}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: "white" }} />
              <Typography variant="body2">
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
