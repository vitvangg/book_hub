import { Grid } from "@mui/material";
import TopicSidebar from "../../components/home/TopicSidebar";
import { useContext, useEffect, useState } from "react";
import { HomeContent } from "./ProtectedLayout";
import { motion } from "framer-motion";

export default function MainLayout({
  children,
  showSidebar: propShowSidebar,
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
}) {
  const context = useContext(HomeContent);
  const showSidebar = propShowSidebar ?? context?.showSidebar ?? true;

  // ✅ Chỉ animate sau lần render đầu tiên
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <Grid
      container
      spacing={1}
      sx={{
        bgcolor: "black",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Grid
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        <motion.div
          initial={false} // 🔹 Không dùng giá trị mặc định (tránh giật)
          animate={
            hasMounted
              ? {
                  width: showSidebar ? 100 : 0,
                  opacity: showSidebar ? 1 : 0,
                }
              : {
                  width: showSidebar ? 100 : 0, // 🔹 Giữ nguyên trạng thái ban đầu, không animate
                  opacity: showSidebar ? 1 : 0,
                }
          }
          transition={{ duration: hasMounted ? 0.4 : 0, ease: "easeInOut" }}
          style={{
            overflow: "hidden",
            height: "100%",
          }}
        >
          <TopicSidebar />
        </motion.div>
      </Grid>

      {/* Main content */}
      <Grid
        sx={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "all 0.4s ease",
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
}
