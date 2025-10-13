import { useState } from "react";
import { Tabs, Tab, Box, Stack, Pagination } from "@mui/material";
import PostCard from "../common/PostCard";

export default function TabsSection() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);

  const tabs = ["Dành cho bạn", "Theo tác giả", "Mới nhất", "Sôi nổi", "Đánh giá cao nhất"];

  // Mỗi tab có 15 bài giả để test
  const allPosts = tabs.map((name) =>
    [...Array(15)].map((_, i) => ({
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-jIuSd4hlWSUD0PXmPRCmiA5uFq2HOMrpKQ&s",
      title: `${name} - Bài viết ${i + 1}`,
      description: "Mô tả ngắn về bài viết...",
      author: "IamSuSu",
      time: "2 giờ trước",
      readTime: "10 phút đọc",
      likes: 120 + i,
      comments: 45 + i,
    }))
  );

  // Phân trang: mỗi trang 5 bài
  const postsPerPage = 5;
  const start = (page - 1) * postsPerPage;
  const end = start + postsPerPage;
  const currentPosts = allPosts[tab].slice(start, end);

  interface TabChangeEvent extends React.SyntheticEvent<Element, Event> {}

  interface Post {
    image: string;
    title: string;
    description: string;
    author: string;
    time: string;
    readTime: string;
    likes: number;
    comments: number;
  }
  const handleTabChange = (e: TabChangeEvent, newVal: number) => {
    setTab(newVal);
    setPage(1); // reset về trang 1 khi đổi tab
  };
  const handlePageChange = (_e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box>
      {/* --- Thanh Tabs --- */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 2,
          "& .MuiTab-root": {
            color: "#bbb",
            textTransform: "none",
            fontWeight: 600,
          },
          "& .Mui-selected": {
            color: "white !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#1db954",
            height: 3,
            borderRadius: 2,
          },
        }}
      >
        {tabs.map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>

      {/* --- Nội dung từng tab --- */}
      <Stack spacing={2} p={2}>
        {currentPosts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}

        {/* --- Phân trang --- */}
        <Stack alignItems="center" mt={3}>
          <Pagination
            count={Math.ceil(allPosts[tab].length / postsPerPage)} // tổng số trang
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
