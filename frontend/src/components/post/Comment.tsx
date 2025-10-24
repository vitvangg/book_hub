import {
  Button,
  Divider,
  InputBase,
  Stack,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";

function Comment() {
  // Danh sách comment giả lập
  const [comments, setComments] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      author: "Benjamin P. Penner",
      avatar:
        "https://i.pinimg.com/originals/6e/93/7d/6e937d33ec57a3e65f5a9b9f457f2f39.jpg",
      time: "Hôm qua",
      content: `Bình luận số ${i + 1} — đây là ví dụ comment.`,
    }))
  );

  const [visibleCount, setVisibleCount] = useState(5); // hiển thị 5 comment đầu

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleSend = () => {
    // ví dụ: thêm comment mới
    setComments((prev) => [
      {
        id: prev.length + 1,
        author: "Bạn",
        avatar: "",
        time: "Vừa xong",
        content: "Đây là comment mới.",
      },
      ...prev,
    ]);
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        mb: 2,
        width: "80%",
        border: "1px solid rgba(255,255,255,0.2)",
        bgcolor: "#212121",
        borderRadius: 2,
        p: 2,
        mx: "auto",
      }}
    >
      {/* Ô nhập comment */}
      <Stack direction="row" spacing={1}>
        <InputBase
          placeholder="Add a comment..."
          sx={{
            color: "white",
            borderRadius: 1,
            p: 1,
            flexGrow: 1,
            border: "1px solid gray",
          }}
        />
        <Button variant="text" onClick={handleSend}>
          Send
        </Button>
      </Stack>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

      {/* Danh sách comment */}
      {comments.slice(0, visibleCount).map((c) => (
        <Stack key={c.id} direction="row" spacing={2} mb={3}>
          <Avatar src={c.avatar} sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography fontWeight={600}>{c.author}</Typography>
            <Typography color="gray" variant="body2">
              {c.time}
            </Typography>
            <Typography sx={{ color: "#ddd", fontSize: 14, mt: 1 }}>
              {c.content}
            </Typography>
          </Box>
        </Stack>
      ))}

      {/* Nút Load more */}
      {visibleCount < comments.length && (
        <Button
          variant="outlined"
          size="small"
          onClick={handleLoadMore}
          sx={{ alignSelf: "center", mt: 1 }}
        >
          Load more comments
        </Button>
      )}
    </Stack>
  );
}

export default Comment;
