import { Box, Tooltip } from "@mui/material";
import { useListTagQuery } from "../../redux/service";
import { useNavigate } from "react-router-dom";
import { setCurrentTag } from "../../redux/slice";
import { useDispatch } from "react-redux";

export default function TopicSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // danh sach tag
  const { data } = useListTagQuery();
  const tagsArray = data?.tags ?? [];

  if (!tagsArray) {
    console.error("Failed to load tags");
    return null;
  }

  function slugify(str: string) {
    return str
      .normalize("NFD")                // tách dấu
      .replace(/[\u0300-\u036f]/g, "") // remove dấu
      .replace(/đ/g, "d")              
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")    // bỏ ký tự đặc biệt
      .replace(/\s+/g, "-")            // space → -
      .replace(/-+/g, "-")             // gộp nhiều dấu - thành 1
      .replace(/^-+|-+$/g, "");        // bỏ - ở đầu/đuôi
  }

  const handleTagClick = (tagName: string, tagId: number) => {
    dispatch(setCurrentTag(tagId));
    navigate(`/topic/${slugify(tagName)}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%", // giữ full chiều cao
        borderRadius: 2,  
        bgcolor: "#121212",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",  
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          py: 2,
          "&::-webkit-scrollbar": {
            width: "12px",
            background: "transparent",
          },
          "&:hover::-webkit-scrollbar": {
            background: "rgba(255, 255, 255, 0.1)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.3)",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.6)",
          },
        }}
      >
        {tagsArray.map((tag: any) => (
          <Tooltip key={tag.tag_id} title={tag.name} placement="right">
            <Box
              component="img"
              src={`/${tag.tag_id}.jpg`}
              alt={tag.name}
              sx={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                transition: "0.2s",
                flexShrink: 0,
              }}
              onClick={() => handleTagClick(tag.name, tag.tag_id)}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
