import { use, useEffect, useRef } from "react";
import PostCard from "../common/PostCard";
import { Stack, Typography, Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useListTrending30Query } from "../../redux/service";
import { useNavigate } from "react-router-dom";

function TrendingContent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const { data: trendingPosts, isLoading, isError } = useListTrending30Query();
  const currentPosts = trendingPosts?.posts || [];

  const handlePostClick = (postID: number) => {
    navigate(`/post/${postID}`);
  };

  useEffect(() => {
    if (isError) {
      console.error("Error fetching trending posts");
    }
  }, []);

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
        {currentPosts.map((post: any, index: number) => (
          <Box key={index} sx={{ flex: "0 0 auto", scrollSnapAlign: "start"}}>
            <PostCard
              title={post.title}
              quote={post.quote}
              author={post.user}
              time={post.createdAt}
              likes={post._count.likes}
              comments={post._count.comments}
              tags={post.tags}
              layout="column"
              onClick={() => handlePostClick(post.post_id)}
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
