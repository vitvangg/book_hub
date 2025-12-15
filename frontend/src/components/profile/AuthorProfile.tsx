import { Box, Avatar, Typography, Button, Stack } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate, useParams } from "react-router-dom";
import { useCheckFollowQuery, useFollowUserMutation } from "../../redux/service";
import { useSelector } from "react-redux";

interface AuthorProfileProps {
  email: string;
  name: string;
  avatarUrl: string;
  followers: number;
  following: number;
  bio: string;
  isCurrentUser: boolean;
}

export default function AuthorProfile({
  email,
  name,
  avatarUrl,
  followers,
  following,
  bio,
  isCurrentUser,
}: AuthorProfileProps) {
  // ✅ State lưu trạng thái follow
  const navigate = useNavigate();
  const { userID } = useParams();
  const { data, refetch } = useCheckFollowQuery(Number(userID));
  const { isAdmin } = useSelector((state: any) => state.service);

  const [follow, followData] = useFollowUserMutation();
  if (followData.isLoading) return <div>Loading...</div>;

  const handleFollow = async () => {
    try {
      await follow(Number(userID)).unwrap();
      await refetch().unwrap();
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#121212",
        color: "white",
        borderRadius: 2,
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Ảnh đại diện */}
      <Avatar
        src={avatarUrl}
        sx={{ width: 120, height: 120, mb: 2, border: "2px solid gray" }}
      />

      {/* Tên hiển thị và email */}
      <Typography variant="h5" fontWeight={700}>
        {name}
      </Typography>
      <Typography color="gray" mb={2}>
        {email}
      </Typography>

      {/* Nút hành động */}
      {(isCurrentUser && !isAdmin) ? (
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/edit-profile");
          }}
          sx={{
            color: "white",
            borderColor: "gray",
            "&:hover": { borderColor: "white" },
            mb: 2,
          }}
        >
          Edit Profile
        </Button>
      ) : (!isAdmin) ? (
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant={data?.data.isFollowing ? "outlined" : "contained"}
            onClick={handleFollow}
            sx={{
              bgcolor: data?.data.isFollowing ? "transparent" : "#1db954",
              color: data?.data.isFollowing ? "white" : "black",
              borderColor: "gray",
              "&:hover": {
                bgcolor: data?.data.isFollowing ? "#222" : "#1ed760",
              },
              minWidth: 100,
            }}
          >
            {data?.data.isFollowing ? "Unfollow" : "Follow"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<ChatBubbleOutlineIcon />}
            sx={{
              color: "white",
              borderColor: "gray",
              "&:hover": { borderColor: "white" },
            }}
          >
            Message
          </Button>
        </Stack>
      ) : null}

      {/* Thống kê */}
      <Stack direction="row" spacing={4}>
        <Box>
          <Typography fontWeight={600}>
            {followers}
          </Typography>
          <Typography color="gray" variant="body2">
            followers
          </Typography>
        </Box>
        <Box>
          <Typography fontWeight={600}>{following}</Typography>
          <Typography color="gray" variant="body2">
            following
          </Typography>
        </Box>
      </Stack>

      {/* Bio */}
      <Box mt={2}>
        <Typography variant="body1">{bio}</Typography>
      </Box>
    </Box>
  );
}
