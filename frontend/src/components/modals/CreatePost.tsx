import {
  Box,
  Stack,
  Typography,
  Avatar,
  Divider,
  TextField,
  MenuItem,
  Chip,
  Button,
} from "@mui/material";
import BlockPost, { type BlockPostRef } from "./BlockPost";
import { useRef, useState } from "react";
import { topics } from "../../config/constants";

export default function CreatePost() {
  const titleRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLElement>(null);
  const blockPostRef = useRef<BlockPostRef>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");

  const currentUser = {
    name: "Nguyen Van Viet Quang",
    avatar:
      "https://i.pinimg.com/originals/6e/93/7d/6e937d33ec57a3e65f5a9b9f457f2f39.jpg",
  };
  const handleCreatePost = () => {
    const blocksData = blockPostRef.current?.exportBlocksData();

    const postData = {
      id: Date.now().toString(),
      title,
      quote,
      topics: selectedTopics,
      author: currentUser.name,
      blocks: blocksData?.blocks, // Để edit sau
      markdownContent: blocksData?.markdown, // Để display
      createdAt: new Date(),
    };

    console.log("Tạo bài viết:", postData);
  };
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100vh",
        borderRadius: 2,
        background: "#121212",
        color: "white",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.2)",
          borderRadius: "4px",
        },
      }}
    >
      {/* Khu vực cuộn nội dung */}
      <Box
        sx={{
          flex: 1,
          px: 4,
          paddingY: "7.6px",
          width: "700px",
          mt: 4,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* Nội dung chính */}
          <Box sx={{ width: "100%" }}>
            {/* Chủ đề */}
            <TextField
              select
              label="Chủ đề"
              value={selectedTopics}
              onChange={(e) =>
                setSelectedTopics(e.target.value as unknown as string[])
              }
              fullWidth
              slotProps={{
                select: {
                  multiple: true,
                  renderValue: (selected) => {
                    const values = selected as string[];
                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {values.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            sx={{ color: "white" }}
                          />
                        ))}
                      </Box>
                    );
                  },
                },
              }}
              sx={{
                mb: 2,
                "& .MuiInputBase-root": { color: "white" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiInputLabel-root": { color: " #212121" },
              }}
            >
              {topics.map((t) => (
                <MenuItem
                  key={t}
                  value={t}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "	#1db954",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#535353",
                    },
                    "&:hover": {
                      backgroundColor: "#535353",
                    },
                  }}
                >
                  {t}
                </MenuItem>
              ))}
            </TextField>

            {/* Tiêu đề */}
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                lineHeight: 1.2,
                mb: 2,
                outline: "none",
                border: "none",
                cursor: "text",
                "&:empty::before": {
                  content: '"Nhập tiêu đề bài viết..."',
                  color: "rgba(255,255,255,0.4)",
                  pointerEvents: "none",
                },
              }}
              contentEditable
              suppressContentEditableWarning
              ref={titleRef}
              onInput={(e) => setTitle((e.target as HTMLElement).innerText)}
            />

            {/* Trích dẫn */}
            <Typography
              sx={{
                fontStyle: "italic",
                color: "rgba(255,255,255,0.6)",
                fontSize: "16px",
                outline: "none",
                border: "none",
                position: "relative",
                "&:empty::before": {
                  content: "'Enter quote here...'",
                  color: "rgba(255,255,255,0.4)",
                  pointerEvents: "none",
                },
              }}
              contentEditable
              suppressContentEditableWarning
              ref={quoteRef}
              onInput={(e) => setQuote((e.target as HTMLElement).innerText)}
              mb={3}
            />

            {/* Thông tin tác giả */}
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
              <Avatar
                src={currentUser.avatar}
                alt="Author"
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography fontWeight={600}>{currentUser.name}</Typography>
                <Typography color="gray" variant="body2">
                  Hôm qua
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 4 }} />

            {/* Nội dung bài viết */}
            <Stack alignContent={"center"} mb={20}>
              <BlockPost ref={blockPostRef} />
            </Stack>

            {/* Nút tạo bài viết */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleCreatePost}
                sx={{
                  background: "#1db954",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": { background: "#1ed760" },
                }}
              >
                Create Post
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
