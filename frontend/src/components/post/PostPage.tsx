import { Box, Stack, Typography, Avatar, Divider, Button } from "@mui/material";
import {  useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import CommentDisplay from "./CommentDisplay";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePostMutation, useGetPostDetailQuery } from "../../redux/service";
import { toast } from "react-toastify";
import TextDisplay from "../modals/feature/Display/TextDisplay";
import QuoteDisplay from "../modals/feature/Display/QuoteDisplay";
import ImageDisplay from "../modals/feature/Display/ImageDisplay";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useSelector } from "react-redux";
import DeletePost from "./DeletePost";

type BlockType = {
  block_id: string;
  content: {
    text?: string;
    image?: string;
    caption?: string;
    quote?: string;
  };
  type?: string;
  order_index?: number;
};

export default function PostPage() {
  const { postID } = useParams();
  const commentRef = useRef<HTMLDivElement | null>(null);
  const { myInfo } = useSelector((state: any) => state.service);
  const { data, isError, isLoading } = useGetPostDetailQuery(String(postID));
  const { isAdmin } = useSelector((state: any) => state.service);

  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();
  // xoa Post
  const [openDelete, setOpenDelete] = useState(false);
  const [deletePost] = useDeletePostMutation();

  const handleComfirmDelete = async () => {
    try {
      await deletePost(String(postID)).unwrap();
      toast.success("Post deleted successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  useEffect(() => {
    if (data && myInfo) {
      setIsAuthor(Number(data.post.user.user_id) === Number(myInfo.user_id));
    }
  }, [data, myInfo]);

  // Lấy post từ data.post
  const post = data?.post;

  const [listBlock, setListBlock] = useState<BlockType[]>([]);
  const tags = post?.tags || [];

  useEffect(() => {
    setListBlock(post?.blocks || []);
  }, [post]);

  // Hàm cuộn xuống phần comment
  const scrollToComment = () => {
    commentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleUpdateClick = async () => {
    navigate(`/post/${postID}/edit`);
  }
  
  useEffect(() => {
    if (isError) {
      toast.error("Không thể tải bài viết. Vui lòng thử lại sau.");
    }
  }, [isError, isLoading]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100vh",
        borderRadius: 2,
        background: "#121212",
        color: "white",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.2)",
          borderRadius: "4px",
        },
      }}
    >
      {/* Nút quay lại */}
      <Box 
        sx={{ 
          position: "fixed", 
          top: 150, 
          left: 200, 
          zIndex: 1001,
          p: 1,
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.2)",
          }
        }}
      >
        <ArrowBackRoundedIcon
          sx={{ 
            cursor: "pointer", 
            color: "white",
            fontSize: 24,
            "&:hover": {
              color: "#1db954"
            }
          }}
          onClick={handleBackClick}
        />
      </Box>
      {/* Khu vực cuộn nội dung */}
      <Box
        sx={{
          flex: 1,
          px: 4,
          paddingY: "7.6px",
          width: "700px",
          mt: 4,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* Nội dung chính */}
          <Box sx={{ width: "100%" }}>
            {/* Chủ đề */}
            <Stack direction="row" spacing={2} mb={2}>
              {tags.map((tag: any, index: number) => (
                <Typography
                  key={index}
                  variant="subtitle1"
                  color="gray"
                  fontWeight={500}
                  mb={1}
                >
                  {`#${tag.name}`}
                </Typography>
              ))}
            </Stack>

            <Stack direction="column" spacing={2} mb={2}>
              {/* Tiêu đề */}
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{ lineHeight: 1.2, mb: 2 }}
              >
                {post?.title}
              </Typography>


              {/* Trích dẫn */}
              <Typography
                sx={{
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "16px",
                  outline: "none",
                  border: "none",
                  mb: 3,
                  position: "relative",
                  "&:empty::before": {
                    content: "'Enter quote here...'",
                    color: "rgba(255,255,255,0.4)",
                    pointerEvents: "none",
                  },
                }}>
                  {post?.quote}
                </Typography>
            </Stack>
            {/* Thông tin tác giả */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={4}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={post?.user.avatar}
                  alt="Author"
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography fontWeight={600}>{post?.user.name}</Typography>
                  <Typography color="gray" variant="body2">
                      {post?.createdAt
                          ? new Date(post.createdAt).toLocaleDateString("vi-VN")
                          : "--/--/----"}
                  </Typography>
                </Box>
              </Stack>
              { (isAuthor || isAdmin) && (
                <Box>
                  {!isAdmin && <Button color="primary" onClick={handleUpdateClick}>Update</Button>}
                  <Button color="error" onClick={() => setOpenDelete(true)}>Delete</Button>

                  <DeletePost
                    open={openDelete}
                    onClose={() => setOpenDelete(false)}
                    onConfirm={handleComfirmDelete}
                  />
                </Box>
              )}
            </Stack>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 4 }} />

            {/* Nội dung bài viết */}
            <Box>
                {/* Nội dung bài viết */}
                <Stack alignContent={"center"} mb={20} spacing={2} sx={{ mt: 4 }}> 
                      {listBlock.map((block: any) => (
                          <Stack key={block.block_id} direction="row" spacing={2} alignItems="flex-start">
                            {/* Nội dung giới hạn 700px */}
                            <Box sx={{ maxWidth: 700, width: "100%" }}>
                              {block.type === "text" && <TextDisplay block={block} />}
                              {block.type === "quote" && <QuoteDisplay block={block} />}
                              {block.type === "image" && <ImageDisplay block={block} />}
                            </Box>
                          </Stack>
                      ))}
                </Stack>
            </Box>
          </Box>          
        </Stack>
        {/* Phần bình luận */}
        <Stack
          justifyContent="center"
          alignItems="center"
          mt={4}
          ref={commentRef}
        >
          <CommentDisplay />
        </Stack>
      </Box>
      {/* Sidebar bên phải */}
      <Box
        sx={{
          position: "fixed",
          top: "200px",
          right: "100px",
          zIndex: 1000,
        }}
      >
        <SideBar post={post} onCommentClick={scrollToComment} />
      </Box>
    </Stack>
  );
}
