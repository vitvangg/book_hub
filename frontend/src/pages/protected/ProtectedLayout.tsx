import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../../components/common/Header";
import { createContext, useContext, useState } from "react";

interface HomeContextType {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HomeContent = createContext<HomeContextType | null>(null);
function ProtectedLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <HomeContent.Provider value={{ showSidebar, setShowSidebar }}>
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
    </HomeContent.Provider>
  );
}

export default ProtectedLayout;
