import { Box, InputBase } from "@mui/material";
import { useEffect, useState } from "react";
import { useCreateBlockMutation } from "../../../../redux/service";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateImage({ order_index }: { order_index: number }) {
  const { postID } = useParams();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [createBlock, { isLoading, isSuccess, isError }] = useCreateBlockMutation();

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleCreateBlock = async () => {
    if (!image) return alert("Chưa chọn ảnh");

    const form = new FormData();
    form.append("type", "image");
    form.append("file", image);
    form.append("caption", caption);
    form.append("order_index", String(order_index));
    form.append("postID", String(postID));

    try {
      await createBlock(form).unwrap();
    } catch (error) {
      console.error("Failed to create block:", error);
    }
  };
  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && caption.trim() !== "") {
        e.preventDefault();
        if (!image) {
            alert("Vui lòng chọn ảnh trước!");
            return;
            }
        await handleCreateBlock();
    }
  };
  useEffect(() => {
    if (isLoading ) {
        toast.info("Đang tải lên ảnh...", { autoClose: 3000 });
    }
    if (isSuccess) {
        toast.success("Tải ảnh lên thành công!", { autoClose: 2000 });
        setCaption("");
        setImage(null);
        setPreview(null);
    }
    if (isError) {
        toast.error("Tải ảnh lên thất bại!", { autoClose: 2000 });
    }
  }, [isLoading, isSuccess, isError]);
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);
  return (
    <Box display="flex" flexDirection="column" gap={1} sx={{ maxWidth: "600px" }}>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleSelectImage}
        style={{ color: "white" }}
      />

      {preview && (
        <Box
          sx={{
            mt: 1,
            width: "20%",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.25)"
          }}
        >
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", display: "block", borderRadius: "8px" }}
          />
        </Box>
      )}

      <InputBase
        multiline
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onKeyDown={handleEnter}
        placeholder="Nhập caption..."
        sx={{
          color: "white",
          fontSize: 16,
          py: 1,
          width: "100%",
        }}
      />
    </Box>
  );
}
