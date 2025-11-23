import { Box, CardMedia, Stack } from "@mui/material";
import TabsTopic from "./TabsTopic";
import { useSelector } from "react-redux";


function TopicContent() {
    // danh sach tag
  const { currentTag } = useSelector((state: any) => state.service);
  const tagId = currentTag;


  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        borderRadius: 2,
        background: " #121212",
        transition: "background 0.5s ease-in-out",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Khu vực cuộn nội dung */}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          py: 3,
          px: 2,
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        {/* --- Noi dung tim kiem --- */}
        <Stack>
          <CardMedia
            component="img"
            image={`/${tagId}.jpg`}
            sx={{ borderRadius: 1, height: 240, objectFit: "cover" }}
          />
        </Stack>

        {/* --- Phần Tabs: Dành cho bạn, Mới nhất,... --- */}
        <Stack direction={"row"} spacing={2}>
          <Box sx={{ flex: 8 }}>
            <TabsTopic />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default TopicContent;
