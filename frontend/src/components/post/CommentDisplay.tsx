import { Avatar, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useListCommentsByPostQuery } from "../../redux/service";
import { useNavigate, useParams } from "react-router-dom";
import RenderReplies from "./Comment/RenderReplies";
import CreateComment from "./Comment/CreateComment";
import CreateReply from "./Comment/CreateReply";

function CommentDisplay() {
  const { postID } = useParams();
  const navigate = useNavigate();

  const [skip, setSkip] = useState(0);
  const [loadmore, setLoadmore] = useState(true);
  const limit = 5;

  const listComment = useListCommentsByPostQuery({
    postID: String(postID),
    skip,
    limit
  });

  const [comments, setComments] = useState<any[]>([]);
  const [activeReply, setActiveReply] = useState<number | null>(null); 

  const handleAvatarClick = (userID: number) => {
    navigate(`/user/${userID}`);
  }

  useEffect(() => {
    if (listComment.isSuccess && listComment.data) {
      if (skip === 0) {
        setComments(listComment.data); // lần đầu: reset
      } else {
        if (listComment.data.length < 5) setLoadmore(false); // không có thêm thì không làm gì
        setComments(prev => [...prev, ...listComment.data]); // load thêm
      }
    }
  }, [listComment.data, listComment.isSuccess, skip]);


  const handleLoadMore = () => {
    setSkip(prev => prev + limit);
  };

  return (
    <Stack sx={{ width: "80%", mx: "auto", p:2 }}>
      <Typography variant="h6" sx={{ mb:2 }}>Comments</Typography>
        <CreateComment />
        {comments.map((c) => (
          <Box key={c.comment_id}>
            <Stack direction="row" spacing={2} mb={3}>
              <Avatar src={c.user.avatar} sx={{ width: 32, height: 32, cursor: "pointer" }} onClick={() => handleAvatarClick(c.user.user_id)} />
              <Box>
                <Typography fontWeight={600}>{c.user.name}</Typography>
                <Typography sx={{ color: "#ddd", fontSize: 14, mt: 1 }}>
                  {c.content}
                </Typography>
                {/* 👇 Nút Reply */}
                <Button
                  size="small"
                  sx={{ color: "#888", mt: 0.5, textTransform: "none" }}
                  onClick={() =>
                    setActiveReply((prev) =>
                      prev === c.comment_id ? null : c.comment_id
                    )
                  }
                >
                  {activeReply === c.comment_id ? "Cancel" : "Reply"}
                </Button>

                {/* 👇 Khi bấm Reply sẽ hiển thị form */}
                {activeReply === c.comment_id && (
                  <Box sx={{ mt: 1 }}>
                    <CreateReply comment_id={c.comment_id} onDone={() => setActiveReply(null)} />
                  </Box>
                )}
                {/* Render replies đệ quy */}
                <RenderReplies replies={c.replies} />
              </Box>
            </Stack>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />
          </Box>
        ))}


      <Button onClick={handleLoadMore} sx={{ alignSelf: "center" }}>
        {loadmore ? "Load More" : "No More Comments"}
      </Button>
    </Stack>
  );
}

export default CommentDisplay;
