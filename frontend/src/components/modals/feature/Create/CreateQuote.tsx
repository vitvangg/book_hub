import { useEffect, useState } from "react";
import { useCreateBlockMutation } from "../../../../redux/service";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, InputBase } from "@mui/material";

export default function CreateQuote({ order_index }: { order_index: number }) {
    const {postID} = useParams()
    const [quote, setQuote] = useState("");

    const [createBlock, createBlockData] = useCreateBlockMutation();
    
    const handleCreateBlock = async () => {
        const form = new FormData();
        form.append("type", "quote");
        form.append("quote", quote);
        form.append("order_index", String(order_index));
        form.append("postID", String(postID));
        try {
            const res = await createBlock(form).unwrap();
            console.log(res.order_index)
        } catch (error) {
            console.error("Failed to create block:", error);
        }
    };

    const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && quote.trim() !== "") {
            e.preventDefault();
            await handleCreateBlock();
        }
    };

    useEffect(() => {
        if (createBlockData.isLoading ) {
            toast.info("Đang tạo block trích dẫn...", { autoClose: 500 });
        }
        if (createBlockData.isSuccess) {
            toast.success("Tạo block trích dẫn thành công!", { autoClose: 1000 });
            setQuote("");
        }
    }, [createBlockData.isLoading]);

    return (
        <Box>
            <InputBase
                multiline
                value={quote}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuote(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="Nhập quote..."
                sx={{
                "&:empty:before": {
                    content: "attr(data-placeholder)",
                    color: "rgba(255,255,255,0.4)",
                },
                borderLeft: "4px solid #1db954",
                pl: 2,
                color: "white",
                outline: "none",
                fontSize: 19,
                py: "7.6px",
                width: "700px",
                maxWidth: "700px",
                whiteSpace: "pre-wrap",
            }}
            />
        </Box>
    );
}