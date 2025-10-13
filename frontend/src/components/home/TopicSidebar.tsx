import { Box, Avatar, Tooltip, CardMedia } from "@mui/material";

const topics = [
  "Art & Photography",
  "Biographies & Memoirs",
  "Business & Economics",
  "How-To & Self Help",
  "Children's Books",
  "Dictionaries",
  "Education & Teaching",
  "Fiction & Literature",
  "Magazines",
  "Medical & Health",
  "Parenting & Relationships",
  "Reference",
  "Science & Technology",
  "History & Politics",
  "Travel & Tourism",
  "Cookbooks & Food",
  "Other",
];

const topicImages = [
  "/images/art.jpg",
  "/images/biographies.jpg",
  "/images/business.jpg",
  "/images/selfhelp.jpg",
  // ... các ảnh khác tương ứng
];

export default function TopicSidebar() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%", // giữ full chiều cao
        borderRadius: 2,  
        bgcolor: "#121212",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",  
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          py: 2,
          "&::-webkit-scrollbar": {
            width: "12px",
            background: "transparent",
          },
          "&:hover::-webkit-scrollbar": {
            background: "rgba(255, 255, 255, 0.1)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.3)",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.6)",
          },
        }}
      >
        {topics.map((topic) => (
          <Tooltip key={topic} title={topic} placement="right">
            <Box
              component="img"
              src="/test.jpg"
              alt={topic}
              sx={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                transition: "0.2s",
                flexShrink: 0,
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
