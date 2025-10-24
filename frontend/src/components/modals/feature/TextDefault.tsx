import { Box } from "@mui/material";
import { useRef, useState, useEffect } from "react";

interface TextDefaultProps {
  onEnter: () => void;
  content: string;
  onContentChange: (content: string) => void;
}

export default function TextDefault({
  onEnter,
  content,
  onContentChange,
}: TextDefaultProps) {
  const editableRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(content === "");

  // Sync content prop với DOM khi component mount hoặc content thay đổi
  useEffect(() => {
    if (editableRef.current && editableRef.current.innerText !== content) {
      editableRef.current.innerText = content;
      setIsEmpty(content.trim() === "");
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = editableRef.current?.innerText || "";
      console.log("Lưu nội dung:", text);
      setIsEmpty(text.trim() === "");
      onEnter();
    }
  };

  const handleInput = () => {
    const text = editableRef.current?.innerText || "";
    setIsEmpty(text.trim() === "");
    onContentChange(text);
  };

  return (
    <Box
      ref={editableRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      sx={{
        color: isEmpty ? "rgba(255,255,255,0.4)" : "#ccc", // placeholder màu mờ
        fontSize: "19px",
        fontFamily: "Noto Serif",
        lineHeight: "32px",
        textAlign: "justify",
        py: "7.6px",
        width: "100%",
        maxWidth: "700px",
        outline: "none",
        whiteSpace: "pre-wrap", // giữ xuống dòng
        mb: "20px",
        "&:empty::before": {
          content: '"Nhập nội dung..."',
          color: "rgba(255,255,255,0.4)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Hiển thị content ban đầu nếu có */}
      {!isEmpty && !editableRef.current?.innerText && content}
    </Box>
  );
}
