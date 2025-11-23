import { Box, Stack, Typography } from "@mui/material";
import TabsSearch from "./TabsSearch";
import { useSearchParams } from "react-router-dom";

export default function SearchContent() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  
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
          <Typography variant="h6" fontWeight={600} color="white" mb={1}>
            Result for "{searchTerm}"
          </Typography>
        </Stack>

        {/* --- Phần Tabs: Dành cho bạn, Mới nhất,... --- */}
        <Stack direction={"row"} spacing={2}>
          <Box sx={{ flex: 8}}>
            <TabsSearch />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
