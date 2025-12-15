import { Avatar, Box, Divider, InputBase, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useCreateCommentMutation } from "../../../redux/service";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


export default function CreateText() {
    const {postID} = useParams()
    const [text, setText] = useState("");

    const [createComment, createCommentData] = useCreateCommentMutation();
    const { myInfo } = useSelector((state: any) => state.service);

    const handleCreateComment = async () => {
        try {
            const data = {
                postID: String(postID),
                content: text,
            }
            await createComment(data).unwrap();
        } catch (error) {
            toast.error("Failed to create comment");
        }
    };

    const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && text.trim() !== "") {
            e.preventDefault();
            await handleCreateComment();
        }
    };

    useEffect(() => {
        if (createCommentData.isLoading ) {
            toast.info("Đang tạo bình luận...", { autoClose: 500 });
        }
        if (createCommentData.isSuccess) {
            toast.success("Tạo bình luận thành công!", { autoClose: 1000 });
            setText("");
        }
    }, [createCommentData.isLoading]);

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
