import { Tabs, Tab, Box, Stack, Pagination } from "@mui/material";
import PostCard from "../common/PostCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useListHotPostsByTagQuery, useListLatestPostsByTagQuery, useListTopRatedPostsByTagQuery} from "../../redux/service";
import { useSelector } from "react-redux";

export default function TabsTopic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const { currentTag } = useSelector((state: any) => state.service);
  const tagId = currentTag;


  const tabs = [
    "Mới nhất",
    "Sôi nổi",
    "Đánh giá cao nhất",
  ];
  const tabMap = {
    "latest": 0,
    "trending": 1,
    "top-rated": 2,
  };
  const reverseTabMap = {
    0: "latest",
    1: "trending",
    2: "top-rated",
  };

  // goi API lấy bài viết theo tag và tab
    const { data: latestByTag } = useListLatestPostsByTagQuery({ page: currentPage, tagId: Number(tagId) });
    const { data: ratedByTag } = useListTopRatedPostsByTagQuery({ page: currentPage, tagId: Number(tagId) });
    const { data: hotByTag } = useListHotPostsByTagQuery({ page: currentPage, tagId: Number(tagId) });


  const currentTab = tabMap[searchParams.get("type") as keyof typeof tabMap] ?? 0;

  let currentPosts = [] as any[];
  let totalPages = 1;

  switch (currentTab) {
    case 0:
      currentPosts = latestByTag?.posts || [];
      totalPages = latestByTag?.totalPages || 1;
      break;
    case 1:
      currentPosts = hotByTag?.posts || [];
      totalPages = hotByTag?.totalPages || 1;
      break;
    case 2:
      currentPosts = ratedByTag?.posts || [];
      totalPages = ratedByTag?.totalPages || 1;
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
