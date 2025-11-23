import { Tabs, Tab, Box, Stack, Pagination } from "@mui/material";
import PostCard from "../common/PostCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useListHotPostsQuery, useListLatestPostsQuery, useListPostByFollowingUsersQuery, useListRatedPostsQuery } from "../../redux/service";

export default function TabsSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const tabs = [
    "Mới nhất",
    "Theo tác giả",
    "Sôi nổi",
    "Đánh giá cao nhất",
  ];
  const tabMap = {
    "latest": 0,
    "by-author": 1,
    "trending": 2,
    "top-rated": 3,
  };
  const reverseTabMap = {
    0: "latest",
    1: "by-author",
    2: "trending",
    3: "top-rated",
  };
  const currentPage = parseInt(searchParams.get("page") || "1");

    // Goi API lấy bài viết mới nhất
  const { data: latestPosts, isLoading } = useListLatestPostsQuery({ page: currentPage });
  const { data: ratedPosts } = useListRatedPostsQuery({ page: currentPage });
  const { data: hotPosts } = useListHotPostsQuery({ page: currentPage });
  const { data: followingPosts } = useListPostByFollowingUsersQuery({ page: currentPage });
  if (isLoading) return <div>Loading...</div>;

  const currentTab = tabMap[searchParams.get("type") as keyof typeof tabMap] ?? 0;
  let currentPosts =  [];
  let totalPages = 1;
  // Đọc từ URL, mặc định tab 0 và page 1
    switch(currentTab) {
      case 0: // Mới nhất
        currentPosts = latestPosts?.posts || [];
        totalPages = latestPosts?.totalPages || 1;
        break;
      case 1: // Theo tác giả
        currentPosts = followingPosts?.posts || [];
        totalPages = followingPosts?.totalPages || 1;
        break;
      case 2: // Sôi nổi
        currentPosts = hotPosts?.posts || [];
        totalPages = hotPosts?.totalPages || 1;
        break;
      case 3: // Đánh giá cao nhất
        currentPosts = ratedPosts?.posts || [];
        totalPages = ratedPosts?.totalPages || 1;
        break;
  }

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

  const handlePostClick = (postID: number) => {
    navigate(`/post/${postID}`);
  };

  return (
    <Box>
      {/* --- Thanh Tabs --- */}
      <Tabs
        value={currentTab}
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleTabChange}
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
        {currentPosts.length === 0 ? (
          <Box sx={{ color: "white", textAlign: "center", mt: 5 }}>
            Không có bài viết nào.
          </Box>
        ) : (
          <>
          {currentPosts.map((post: any, index: number) => (
            <PostCard
                key={index}
                title={post.title}
                quote={post.quote}
                author={post.user}
                time={post.createdAt}
                likes={post._count.likes}
                comments={post._count.comments}
                tags={post.tags}
                layout="row"
                onClick={() => handlePostClick(post.post_id)} 
            />
          ))}

          {/* --- Phân trang --- */}
          <Stack alignItems="center" mt={3}>
            <Pagination
              count={totalPages || 1}
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
          </>
        )}
      </Stack>
    </Box>
  );
}
