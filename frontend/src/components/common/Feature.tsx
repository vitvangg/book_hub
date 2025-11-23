import { useState } from "react";
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
import { useCreateDraftPostMutation, useLogoutMutation } from "../../redux/service";
import { useDispatch, useSelector } from "react-redux";
import { clearMyInfo } from "../../redux/slice";
import { toast } from "react-toastify";

export default function Feature() {
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const settings = ["Trang cá nhân", "Đăng xuất"];
  const navigate = useNavigate();

  const { myInfo } = useSelector((state: any) => state.service);
  console.log("myInfo in Feature:", myInfo);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const [createDraftPost] = useCreateDraftPostMutation();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigateToProfile = () => {
    navigate(`/user/${myInfo.user_id}`);
    handleCloseUserMenu();
  };

  const handleLogout = async () => {
    try {
      await logout(null as any).unwrap();
      dispatch(clearMyInfo());
      navigate("/home");
      handleCloseUserMenu();
      toast.success("Logout successful!");
    } catch (error) {
      toast.error("Failed to log out");
    }
  }
  const handleClickNewPost = async () => {
    try {
      const res = await createDraftPost().unwrap();
      const postID = res.post.post_id;
      navigate(`/create/${postID}`);
    } catch (error) {
      toast.error("Failed to create new post");
    }
  }
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
        onClick={handleClickNewPost}
      >
        New post
      </Button>

      {/* Avatar */}
      <Box>
        <Tooltip title="Account settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              alt="User Avatar"
              src={myInfo?.avatar || "/default_avatar.png"}
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
              onClick={() => {
                if (setting === "Đăng xuất") {
                  handleLogout();
                } else if (setting === "Trang cá nhân") {
                  handleNavigateToProfile();
                }
              }}
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

