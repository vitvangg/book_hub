import { useRef } from "react";
import PostCard from "../common/PostCard";
import { Stack, Typography, Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

function TrendingContent() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Stack position="relative" >
      <Typography variant="h5" color="white" fontWeight={700} m={2} fontSize={20}>
        Bài viết nổi bật trong tháng
      </Typography>

      {/* Nút cuộn trái */}
      <IconButton
        onClick={() => scroll("left")}
        sx={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        <ChevronLeft />
      </IconButton>

      {/* Khu vực chứa danh sách bài viết */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          px: 6,
          py: 1,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",          // Firefox
          msOverflowStyle: "none",         // IE, Edge cũ
          "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Opera
        }}
      >
        {[...Array(10)].map((_, i) => (
          <Box key={i} sx={{ flex: "0 0 auto", scrollSnapAlign: "start" }}>
            <PostCard
              layout="column"
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-jIuSd4hlWSUD0PXmPRCmiA5uFq2HOMrpKQ&s"
              title={`Bài viết ${i + 1}`}
              description="Mô tả ngắn..."
              author="IamSuSu"
              time="Hôm qua"
              readTime="19 phút đọc"
              likes={120 + i}
              comments={45 + i}
            />
          </Box>
        ))}
      </Box>

      {/* Nút cuộn phải */}
      <IconButton
        onClick={() => scroll("right")}
        sx={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        <ChevronRight />
      </IconButton>
    </Stack>
  );
}

export default TrendingContent;
