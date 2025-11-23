import { Box, InputBase } from "@mui/material";
import { useState, useEffect } from "react";
import { useCreateBlockMutation } from "../../../../redux/service";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


export default function CreateText({order_index}: {order_index: number}) {
    const {postID} = useParams()
    const [text, setText] = useState("");

    const [createBlock, createBlockData] = useCreateBlockMutation();
    
    const handleCreateBlock = async () => {
        const form = new FormData();
        form.append("type", "text");
        form.append("text", text);
        form.append("order_index", String(order_index));
        form.append("postID", String(postID));
        try {
            await createBlock(form).unwrap();
        } catch (error) {
            console.error("Failed to create block:", error);
        }
    };

    const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && text.trim() !== "") {
            e.preventDefault();
            await handleCreateBlock();
        }
    };

    useEffect(() => {
        if (createBlockData.isLoading ) {
            toast.info("Đang tạo block văn bản...", { autoClose: 500 });
        }
        if (createBlockData.isSuccess) {
            toast.success("Tạo block văn bản thành công!", { autoClose: 1000 });
            setText("");
        }
    }, [createBlockData.isLoading]);

    return (
    <Box>
       <InputBase
            multiline
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Nhập nội dung..."
            sx={{
            "&:empty:before": {
                content: "attr(data-placeholder)",
                color: "rgba(255,255,255,0.4)",
            },
            color: "white",
            outline: "none",
            fontSize: 19,
            py: "7.6px",
            width: "100%",
            whiteSpace: "pre-wrap",
         }}
       />
    </Box>
  );
}
