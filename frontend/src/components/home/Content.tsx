import { Box } from "@mui/material";
import TrendingContent from "./TrendingContent";  // phần bài viết nổi bật
import TabSection from "./TabsSection";   // phần tab bài viết
import { useEffect, useState } from "react";

export default function Content() {

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        borderRadius: 2,
        background: " #212121",
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
        {/* --- Bài viết nổi bật trong tháng --- */}
          <TrendingContent />

        {/* --- Phần Tabs: Dành cho bạn, Mới nhất,... --- */}
        <TabSection />
      </Box>
    </Box>
  );
}
