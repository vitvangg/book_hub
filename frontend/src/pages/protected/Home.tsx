import { Grid, Stack } from "@mui/material";
import TopicSidebar from "../../components/home/TopicSidebar";
import Content from "../../components/home/Content";
import TabsSection from "../../components/home/TabsSection";

export default function Home() {
  return (
    <Grid
      container
      spacing={1}
      sx={{
        bgcolor: "black",
        height: "100%", // cần có để khớp với ProtectedLayout
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Grid
        size={{ xs: 12, md: 1 }}
        sx={{
          height: "100%", // bắt buộc để cho phép con tính toán đúng
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TopicSidebar />
      </Grid>

      {/* Main content */}
      <Grid
        size={{ xs: 12, md: 11 }}
        sx={{
          height: "100%", // giữ full chiều cao
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Content />
      </Grid>
    </Grid>
  );
}
