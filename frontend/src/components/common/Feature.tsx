import { use, useState } from "react";
import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

export default function Feature() {
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const settings = ["Trang cá nhân", "Đăng xuất"];
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        height: "48px",
        px: 2,
        borderRadius: 2,
      }}
    >
      {/* Tin nhắn */}
      <IconButton
        sx={{
          transition: "all 0.2s ease",
          "& svg": {
            color: "rgba(255,255,255,0.5)",
            transition: "all 0.2s ease",
          },
          "&:hover svg": { color: "white", transform: "scale(1.03)" },
          "&:active svg": { transform: "scale(0.95)" },
        }}
      >
        <Badge
          badgeContent={2}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#1db954", // giữ màu xanh cố định
              color: "white",
            },
          }}
        >
          <MailIcon />
        </Badge>
      </IconButton>

      {/* Thông báo */}
      <IconButton
        sx={{
          transition: "all 0.2s ease",
          "& svg": {
            color: "rgba(255,255,255,0.5)",
            transition: "all 0.2s ease",
          },
          "&:hover svg": { color: "white", transform: "scale(1.03)" },
          "&:active svg": { transform: "scale(0.95)" },
        }}
      >
        <Badge
          badgeContent={5}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#1db954", // luôn màu xanh
              color: "white",
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Viết bài */}
      <Button
        disableRipple
        sx={{
          color: "#535353",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "all 0.2s ease",
          "&:hover": { color: "white", transform: "scale(1.03)" },
          "&:active": { transform: "scale(0.95)" },
        }}
        onClick={() => navigate("/create")}
      >
        New post
      </Button>

      {/* Avatar */}
      <Box>
        <Tooltip title="Account settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              alt="User Avatar"
              src="/static/images/avatar/2.jpg"
              sx={{
                width: 40,
                height: 40,
                border: "4px solid #282828",
                transition: "all 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
                "&:active": { transform: "scale(0.95)" },
              }}
            />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              bgcolor: "#212121",
              color: "#fff",
              borderRadius: 2,
              minWidth: 180,
            },
          }}
        >
          {settings.map((setting) => (
            <MenuItem
              key={setting}
              onClick={handleCloseUserMenu}
              sx={{
                fontSize: "14px",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              {setting}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Stack>
  );
}
