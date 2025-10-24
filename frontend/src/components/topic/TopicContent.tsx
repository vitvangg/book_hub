import { Box, CardMedia, Stack, Typography } from "@mui/material";
import { useState } from "react";
import TabsTopic from "./TabsTopic";
import { topics } from "../../config/constants";

const topicImages = [
  "https://images.unsplash.com/photo-1504198458649-3128b932f49b", // 🎨 Art & Photography
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d", // 📖 Biographies & Memoirs
  "https://images.unsplash.com/photo-1556761175-4b46a572b786", // 💼 Business & Economics
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b", // 📘 How-To & Self Help
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9", // 🧒 Children's Books
  "https://images.unsplash.com/photo-1581090700227-1e37b190418e", // 📚 Dictionaries
  "https://images.unsplash.com/photo-1600195077909-6b1e56c1d7d9", // 🎓 Education & Teaching
  "https://images.unsplash.com/photo-1528207776546-365bb710ee93", // ✍️ Fiction & Literature
  "https://images.unsplash.com/photo-1554200876-56c2f25224fa", // 📰 Magazines
  "https://images.unsplash.com/photo-1588776814546-ec7a9b9b1d1f", // 🏥 Medical & Health
  "https://images.unsplash.com/photo-1604881991181-5b6a6a4dbdf5", // 👨‍👩‍👧 Parenting & Relationships
  "https://images.unsplash.com/photo-1590608897129-79da98d15943", // 📗 Reference
  "https://images.unsplash.com/photo-1581091870622-4c0b9d6bfa52", // 🔬 Science & Technology
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05", // 🏛️ History & Politics
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // ✈️ Travel & Tourism
  "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da", // 🍳 Cookbooks & Food
  "https://images.unsplash.com/photo-1473187983305-f615310e7daa", // 🌈 Other
];

function TopicContent() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        borderRadius: 2,
        background: " #121212",
        transition: "background 0.5s ease-in-out",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Khu vực cuộn nội dung */}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          py: 3,
          px: 2,
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        {/* --- Noi dung tim kiem --- */}
        <Stack>
          <CardMedia
            component="img"
            image={
              "https://images.unsplash.com/photo-1504198458649-3128b932f49b"
            }
            alt={selectedTopic}
            sx={{ borderRadius: 1, height: 140, objectFit: "cover" }}
          />
        </Stack>

        {/* --- Phần Tabs: Dành cho bạn, Mới nhất,... --- */}
        <Stack direction={"row"} spacing={2}>
          <Box sx={{ flex: 8 }}>
            <TabsTopic topic={selectedTopic} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default TopicContent;
