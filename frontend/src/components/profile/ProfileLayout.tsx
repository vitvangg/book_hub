import { Grid } from "@mui/material";
import AuthorProfile from "./AuthorProfile";
import TabsProfile from "./TabsProfile";

function ProfileLayout() {
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
      {/* Sidebar luôn tồn tại, chỉ thay đổi width */}
      <Grid
        sx={{
          height: "80%",
          width: "25%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "all 0.3s ease",
          borderRadius: 2,
          background: "#121212",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AuthorProfile
          username="john_doe"
          displayName="John Doe"
          avatarUrl="https://example.com/avatar.jpg"
          followers={120}
          following={80}
          isCurrentUser={false}
        />
      </Grid>

      {/* Main content — luôn chiếm phần còn lại */}
      <Grid
        sx={{
          background: " #121212",
          borderRadius: 2,
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          transition: "all 0.4s ease",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        <TabsProfile />
      </Grid>
    </Grid>
  );
}
export default ProfileLayout;
