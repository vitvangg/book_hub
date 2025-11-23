import { Avatar, Box, Divider, InputBase, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useReplyCommentMutation } from "../../../redux/service";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


export default function CreateReply({ comment_id, onDone }: { comment_id: string, onDone: () => void }) {
    const {postID} = useParams()
    const [text, setText] = useState("");

    const [CreateReply, createReplyData] = useReplyCommentMutation();
    const { myInfo } = useSelector((state: any) => state.service);

    const handleCreateComment = async () => {
        const data = {
            postID: String(postID),
            content: text,
            commentID: comment_id,
        }
        await CreateReply(data).unwrap();
        onDone && onDone();
    };

    const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && text.trim() !== "") {
            e.preventDefault();
            await handleCreateComment();
        }
    };

    useEffect(() => {
        if (createReplyData.isLoading ) {
            toast.info("Đang tạo bình luận...", { autoClose: 500 });
        }
        if (createReplyData.isSuccess) {
            toast.success("Tạo bình luận thành công!", { autoClose: 1000 });
            setText("");
        }
    }, [createReplyData.isLoading]);

    return (
        <Box >
            <Stack direction="row" spacing={2} mb={3}>
            <Avatar src={myInfo.avatar} sx={{ width: 32, height: 32 }} />
                <Box>
                    <Typography fontWeight={600}>{myInfo.name}</Typography>
                    <InputBase
                        sx={{ color: "#ddd", fontSize: 14, mt: 1 }}
                        placeholder="Nhập nội dung..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleEnter}
                    />
                </Box>
            </Stack>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />
        </Box>
        );
}
