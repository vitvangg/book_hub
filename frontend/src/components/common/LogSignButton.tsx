import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LogSignButton() {
  const navigate = useNavigate();
  function handleLoginClick() {
    navigate("/login");
  }
  function handleSignUpClick() {
    navigate("/sign-up");
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "48px",
        width: "181px",
        mx: "auto",
        border: "2px solid transparent",
      }}
    >
      {/* Sign Up */}
      <Button
        disableRipple
        sx={{
          width: "72px",
          height: "32px",
          color: "#b3b3b3",
          textTransform: "none",
          fontSize: "13px",
          fontWeight: "bold",
          transition: "all 0.2s ease",
          "&:hover": {
            color: "white",
            transform: "scale(1.03)", // to ra khoảng 3%
          },
          "&:active": {
            transform: "scale(0.95)", // thu nhỏ 5% khi bấm
          },
        }}
        onClick={handleSignUpClick}
      >
        Sign Up
      </Button>

      {/* Login */}
      <Button
        sx={{
          width: "108px",
          height: "100%",
          borderRadius: "9999px",
          bgcolor: "white",
          color: "black",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "all 0.2s ease",
          "&:hover": { transform: "scale(1.03)" },
          "&:active": {
            transform: "scale(0.95)", // thu nhỏ 5% khi bấm
          },
        }}
        onClick={handleLoginClick}
      >
        Login
      </Button>
    </Box>
  );
}

export default LogSignButton;
