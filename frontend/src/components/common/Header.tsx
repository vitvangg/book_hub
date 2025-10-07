import { Stack, Box } from "@mui/material"
import { GoHomeFill } from "react-icons/go";
import Search from "./Search";
import Navbar from "./Navbar";

function Header() {
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
        { /* Left - Logo & Home */ }
        <Stack direction={"row"} alignItems={"center"} spacing={2} ml={2}>
          <img src="./public/logo_white.svg" alt="logo" style={{ width: 48, height: 48 }} />
          <Box sx={{ borderRadius: "100%", bgcolor: "#282828", width: 48, height: 48, display: "flex", justifyContent: "center", alignItems: "center", p: 0 }}>
            <GoHomeFill style={{ color: "white", fontSize: 30 }} />
          </Box>
        </Stack>
        { /* Center - Search */ }
        <Stack>
          <Search />
        </Stack>
        { /* Right - Auth */ }
        <Stack>
          <Navbar />
        </Stack>
      </Stack>
    </header>
  )
}
export default Header