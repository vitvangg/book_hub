import { Box, Button, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface LoadImageProps {
  onEnter: () => void;
  content: string;
  onContentChange: (content: string) => void;
}

export default function LoadImage({
  onEnter,
  content,
  onContentChange,
}: LoadImageProps) {
  // Parse content: "url|caption"
  const [url, captionFromContent] = content ? content.split("|") : ["", ""];
  const [preview, setPreview] = useState<string | null>(url || null);
  const [caption, setCaption] = useState(captionFromContent || "");
  const [finalCaption, setFinalCaption] = useState<string | null>(
    captionFromContent || null
  );

  // Sync content prop với state khi thay đổi
  useEffect(() => {
    const [newUrl, newCaption] = content ? content.split("|") : ["", ""];
    setPreview(newUrl || null);
    setCaption(newCaption || "");
    setFinalCaption(newCaption || null);
  }, [content]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setCaption("");
      setFinalCaption(null);
      onContentChange(`${imageUrl}|`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const finalCap = caption.trim();
      setFinalCaption(finalCap);
      onContentChange(`${preview}|${finalCap}`);
      onEnter();
    }
  };

  return (
    <Box textAlign="center">
      {!preview && (
        <Button variant="contained" component="label">
          Chọn ảnh
          <input type="file" hidden accept="image/*" onChange={handleUpload} />
        </Button>
      )}

      {preview && (
        <Box
          display="inline-block"
          textAlign="center"
          mb={2.5}
          justifyContent={"center"}
          ml={"30px"}
        >
          {/* Ảnh */}
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100%",
              maxWidth: 640,
              maxHeight: 360,
              objectFit: "cover",
              borderRadius: 8,
              display: "block",
            }}
          />

          {/* Khi chưa Enter → hiện ô nhập caption ở dưới ảnh */}
          {!finalCaption && (
            <TextField
              variant="standard"
              placeholder="Nhập caption và nhấn Enter..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onKeyDown={handleKeyDown}
              inputProps={{
                style: {
                  color: "white",
                  fontSize: "1rem",
                  textAlign: "center",
                  textShadow: "0 0 2px rgba(0,0,0,0.6)",
                },
              }}
              sx={{
                mt: 1.5,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 1,
                px: 1,
                width: "80%",
                maxWidth: 500,
              }}
            />
          )}

          {/* Khi Enter → caption cố định dưới ảnh */}
          {finalCaption && (
            <Typography
              variant="body1"
              sx={{
                mt: 1.5,
                color: "white",
                fontSize: "13px",
                textShadow: "0 0 2px rgba(0,0,0,0.6)",
                fontWeight: 400,
              }}
            >
              {finalCaption}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
