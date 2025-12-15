import { Tabs, Tab, Box, Stack, Pagination } from "@mui/material";
import PostCard from "../common/PostCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useListPostByUserQuery } from "../../redux/service";

export default function TabsProfile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userID } = useParams();

  const currentPage = parseInt(searchParams.get("page") || "1");

  // Goi API lấy bài viết của user
  const { data, isLoading } = useListPostByUserQuery({ userID: Number(userID), page: currentPage });
  if (isLoading) return <div>Loading...</div>;

  const currentTab = 0
  const currentPosts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

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
        <Tab label="Bài viết" />
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
                image={post.image_url || "/meme.jpg"}
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
