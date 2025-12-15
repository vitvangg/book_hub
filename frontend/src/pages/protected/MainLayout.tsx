import { Grid } from "@mui/material";
import TopicSidebar from "../../components/home/TopicSidebar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useSelector((state: any) => state.service);

  // ✅ Tự động thêm ?page=1 nếu chưa có
  useEffect(() => {
    if (!searchParams.get("page") && (location.pathname === "/home" || location.pathname === "/admin"
    || location.pathname === "/admin/users" || location.pathname === "/admin/reports"
    )) {
      setSearchParams({ page: "1" });
    }
  }, [searchParams, setSearchParams]);


  const { openFilterModal } = useSelector((state: any) => state.service);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  return (
    <Grid container spacing={1} sx={{ bgcolor: "black", height: "100%", overflow: "hidden" }}>
      {/* Sidebar */}
      <Grid sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", transition: "all 0.3s ease" }}>
        <motion.div
          initial={false}
          animate={
            hasMounted
              ? { width: openFilterModal ? (isAdmin ? 140 : 100) : 0, opacity: openFilterModal ? 1 : 0 }
              : { width: openFilterModal ? (isAdmin ? 140 : 100) : 0, opacity: openFilterModal ? 1 : 0 }
          }
          transition={{ duration: hasMounted ? 0.4 : 0, ease: "easeInOut" }}
          style={{ overflow: "hidden", height: "100%" }}
        >
          {isAdmin ? <AdminSidebar /> : <TopicSidebar />}
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
