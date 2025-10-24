import { Tabs, Tab, Box, Stack, Pagination } from "@mui/material";
import PostCard from "../common/PostCard";
import { useSearchParams } from "react-router-dom";

export default function TabsProfile() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = ["Posts"];
  const tabMap = { post: 0 };
  const reverseTabMap = { 0: "post" };

  // Đọc từ URL, mặc định tab 0 (Article) và page 1
  const currentTab =
    tabMap[searchParams.get("type") as keyof typeof tabMap] ?? 0;
  const currentPage = parseInt(searchParams.get("page") || "1");

  // Mỗi tab có 15 bài giả để test
  const allPosts = tabs.map((name) =>
    [...Array(15)].map((_, i) => ({
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-jIuSd4hlWSUD0PXmPRCmiA5uFq2HOMrpKQ&s",
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
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const currentPosts = allPosts[currentTab].slice(start, end);

  interface TabChangeEvent extends React.SyntheticEvent<Element, Event> {}

  const handleTabChange = (_e: TabChangeEvent, newVal: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("type", reverseTabMap[newVal as keyof typeof reverseTabMap]);
    params.set("page", "1"); // reset về trang 1 khi đổi tab
    setSearchParams(params);
  };

  const handlePageChange = (_e: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", value.toString());
    setSearchParams(params);
  };

  return (
    <Box>
      {/* --- Thanh Tabs --- */}
      <Tabs
        value={currentTab}
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
            count={Math.ceil(allPosts[currentTab].length / postsPerPage)} // tổng số trang
            page={currentPage}
            onChange={handlePageChange}
            size="large"
            siblingCount={1}
            boundaryCount={1}
            sx={{
              color: "white",
              "& .MuiPaginationItem-root": {
                color: "white", // 🎨 màu chữ
                "&:hover": {
                  bgcolor: "#1db954", // 🎨 màu khi hover
                },
                "&.Mui-selected": {
                  bgcolor: "white", // 🎨 màu nút đang chọn
                  color: "#121212", // 🎨 màu chữ nút đang chọn
                },
              },
            }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
