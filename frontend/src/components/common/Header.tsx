import { Stack, Box } from "@mui/material";
import { GoHomeFill } from "react-icons/go";
import Search from "./Search";
import Navbar from "./LogSignButton";
import Feature from "./Feature";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { HomeContent } from "../../pages/protected/ProtectedLayout";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setShowSidebar } = useContext(HomeContent)!;

  function handleHomeClick() {
    navigate("/");
  }
  function handleSidebarToggle() {
    if (location.pathname !== "/author") {
      setShowSidebar((prev) => !prev);
    }
  }
  return (
    <header>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        position={"sticky"}
        py={1}
        px={2}
        bgcolor={"black"}
        maxHeight={64}
      >
        {/* Left - Logo & Home */}
        <Stack direction={"row"} alignItems={"center"} spacing={2} ml={2}>
          <Box onClick={handleSidebarToggle}>
            <img
              src="./public/logo_white.svg"
              alt="logo"
              style={{ width: 48, height: 48 }}
            />
          </Box>
          <Box
            sx={{
              borderRadius: "100%",
              bgcolor: "#282828",
              width: 48,
              height: 48,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                borderColor: "#403F3F",
                bgcolor: "#3E3E3E",
              },
              "&:focus-within": {
                borderColor: "#F7F7F7",
              },
              "&:hover .home-icon": { color: "#F7F7F7 !important" },
              "&:focus-within .home-icon": { color: "#F7F7F7 !important" },
            }}
            onClick={handleHomeClick}
          >
            <GoHomeFill
              className="home-icon"
              style={{
                color:
                  location.pathname === "/"
                    ? "#F7F7F7"
                    : "rgba(255,255,255,0.5)", // 🔹 check current route
                fontSize: 30,
                transition: "color 0.3s ease-in-out",
              }}
            />
          </Box>

          <Search />
        </Stack>
        {/* Center - Search */}
        {/* Right - Auth */}
        <Stack>
          <Feature />
        </Stack>
      </Stack>
    </header>
  );
}
export default Header;
