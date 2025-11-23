import { Box,  InputBase } from "@mui/material";
import {  useState } from "react";
import {  useUpdateBlockMutation } from "../../../../redux/service";

interface QuoteUpdateProps {
  postID?: string;
  blockID: string;
  defaultValue: string;
  onDone?: (newText: string) => void;
    onCancel?: () => void;
}

export default function QuoteUpdate({ postID, blockID, defaultValue, onDone, onCancel }: QuoteUpdateProps) {
  const [text, setText] = useState(defaultValue);
  const [updateBlock] = useUpdateBlockMutation();

  const handleUpdateBlock = async () => {
    const form = new FormData();
    form.append("quote", text);
    await updateBlock({ blockID, formData: form, postID }).unwrap();
    onDone && onDone(text);
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleUpdateBlock();
    }
    if (e.key === "Escape" && onCancel) onCancel();
  };

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
            bgcolor: "rgba(255,255,255,0.4)",
            outline: "none",
            fontSize: 19,
            py: "7.6px",
            width: "700px",
            whiteSpace: "pre-wrap",
            maxWidth: "700px",
            borderLeft: "4px solid #1db954",
            pl: 2,
         }}
       />
    </Box>
  );
}
