import { Grid } from "@mui/material";
import AuthorProfile from "./AuthorProfile";
import TabsProfile from "./TabsProfile";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useGetUserDetailQuery } from "../../redux/service";

function ProfileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userID } = useParams(); // lấy id từ route :userID
  const { data, isError, isLoading } = useGetUserDetailQuery(String(userID));
  const { myInfo } = useSelector((state: any) => state.service);

  const [isMyProfile, setIsMyProfile] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.has("page")) {
      navigate(`/user/${userID}?page=1`, { replace: true });
    }

    if (Number(userID) !== Number(myInfo.user_id)) {
      setIsMyProfile(false);
    } else {
      setIsMyProfile(true);
    }
  }, [userID, myInfo, navigate, location.search]);

  if (isLoading) return <div style={{ color: "white" }}>Đang tải...</div>;
  if (isError || !data?.data) return <div style={{ color: "white" }}>Lỗi khi tải dữ liệu</div>;

  const userData = data.data; // lấy data trực tiếp từ API trả về


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
        {isMyProfile ? (
          <AuthorProfile
            email={myInfo.email}
            name={myInfo.name}
            avatarUrl={myInfo.avatar}
            followers={myInfo.followers_count}
            following={myInfo.following_count}
            bio={myInfo.bio}
            isCurrentUser={isMyProfile}
          />
        ) : (
          <AuthorProfile
            email={userData.email}
            name={userData.name}
            avatarUrl={userData.avatar}
            followers={userData.followers_count}
            following={userData.following_count}
            bio={userData.bio}
            isCurrentUser={isMyProfile}
          />
        )}
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
