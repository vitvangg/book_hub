import { Box, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const listManager = ["Dashboard", "Users", "Posts", "Tags", "Reports"];

  function slugify(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const handleClick = (feature: string) => {
    navigate(`/admin/${slugify(feature)}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 2,
        bgcolor: "#121212",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          py: 2,
        }}
      >
        {listManager.map((feature) => (
          <Tooltip key={feature} title={feature} placement="right">
            <Box
              onClick={() => handleClick(feature)}
              sx={{
                width: "70%",           // full đẹp hơn icon 64px
                p: 1.5,
                borderRadius: 2,
                border: "1px solid #333",
                bgcolor: "#1e1e1e",
                cursor: "pointer",
                textAlign: "center",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "#272727",
                  borderColor: "#555",
                },
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                {feature}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
