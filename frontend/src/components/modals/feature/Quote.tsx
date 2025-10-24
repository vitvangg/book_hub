import { Box } from "@mui/material";
import { useRef, useState, useEffect } from "react";

interface QuoteProps {
  onEnter: () => void;
  content: string;
  onContentChange: (content: string) => void;
}

export function Quote({ onEnter, content, onContentChange }: QuoteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [quote, setQuote] = useState(content);

  // Sync content prop với DOM khi component mount hoặc content thay đổi
  useEffect(() => {
    if (ref.current && ref.current.innerText !== content) {
      ref.current.innerText = content;
      setQuote(content);
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // tránh xuống dòng
      const text = ref.current?.innerText || "";
      setQuote(text);
      onContentChange(text);
      onEnter();
    }
  };

  const handleInput = () => {
    const text = ref.current?.innerText || "";
    setQuote(text);
    onContentChange(text);
  };

  return (
    <Box
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      sx={{
        borderLeft: "4px solid #1db954",
        pl: 2,
        fontStyle: "italic",
        fontFamily: "Noto Serif",
        color: "white",
        fontSize: "14px",
        lineHeight: "32px",
        textAlign: "justify",
        width: "100%",
        maxWidth: 680,
        py: "7.6px",
        whiteSpace: "pre-wrap",
        mb: "20px",
      }}
    >
      {/* Hiển thị content ban đầu nếu có */}
      {!quote && !ref.current?.innerText ? "Nhập trích dẫn..." : quote}
    </Box>
  );
}
