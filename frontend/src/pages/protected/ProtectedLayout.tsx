import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../../components/common/Header";

function ProtectedLayout() {
  return (
      <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        overflow={"hidden"}
      >
        <Header />
        <Box flex={1} overflow="hidden" height={"100%"}>
          <Outlet />
        </Box>
      </Box>
  );
}

export default ProtectedLayout;
