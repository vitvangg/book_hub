import { Tabs, Tab, Box, Stack, Pagination } from "@mui/material";
import PostCard from "../common/PostCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useListPostBySearchQuery, useListUserBySearchQuery } from "../../redux/service";
import UserCard from "../common/UserCard";

export default function TabsSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabs = ["Article", "Author"];
  const tabMap = { post: 0, author: 1 };
  const reverseTabMap = { 0: "post", 1: "author" };
  const searchTerm = searchParams.get('q') || '';

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentUserPage = parseInt(searchParams.get("page") || "1");

  // gọi API lấy bài viết theo từ khóa tìm kiếm
  const { data: latestByTag } = useListPostBySearchQuery({ page: currentPage, searchTerm });
  const { data: userBySearch } = useListUserBySearchQuery({ page: currentUserPage, searchTerm });

  const currentTab = tabMap[searchParams.get("type") as keyof typeof tabMap] ?? 0;
  let currentPosts = [] as any[];
  let currentUsers = [] as any[];
  let totalPages = 1;
  let totalUserPages = 1;
  switch (currentTab) {
    case 0:
      currentPosts = latestByTag?.data || [];
      totalPages = latestByTag?.totalPages || 1;
      break;
    case 1:
      currentUsers = userBySearch?.data || [];
      totalUserPages = userBySearch?.totalPages || 1;
      break;
    default:
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
  const handleUserPageChange = (_e: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", value.toString());
    setSearchParams(params);
  };
  const handlePostClick = (postID: number) => {
    navigate(`/post/${postID}`);
  };
  const handleUserClick = (userID: number) => {
    navigate(`/user/${userID}`);
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
      {currentTab === 0 && (
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
                  image={post.image_url || "/meme.jpg"}
                  title={post.title}
                  quote={post.quote}
                  author={post.user}
                  time={post.createdAt}
                  likes={post.like_count}
                  comments={post.comment_count}
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
      </Stack>)}
      {currentTab === 1 && (
        <>
          {currentUsers.length === 0 ? (
            <Box sx={{ color: "white", textAlign: "center", mt: 5 }}>
              Không có người dùng nào.
            </Box>
          ) : (
            <>
              {currentUsers.map((user: any) => (
                <UserCard
                  key={user.user_id}
                  name={user.name}
                  avatar={user.avatar}
                  onClick={() => handleUserClick(user.user_id)}
                />
              ))}

              {/* --- Phân trang người dùng --- */}
              <Stack alignItems="center" mt={3}>
                <Pagination
                  count={totalUserPages || 1}  // tổng số trang người dùng
                  page={currentUserPage}        // page hiện tại
                  onChange={handleUserPageChange} // hàm đổi trang
                  size="large"
                  siblingCount={1}
                  boundaryCount={1}
                  sx={{
                    color: "white",
                    "& .MuiPaginationItem-root": {
                      color: "white",
                      "&:hover": { bgcolor: "#1db954" },
                      "&.Mui-selected": { bgcolor: "white", color: "#121212" },
                    },
                  }}
                />
              </Stack>
            </>
          )}
        </>
      )}

    </Box>
  );
}
