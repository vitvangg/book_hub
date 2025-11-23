import {
  Stack,
  Avatar,
  IconButton,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useEffect, useRef, useState } from "react";
import { useUpdateMyInfoMutation } from "../../redux/service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


function EditProfile() {
  const { myInfo } = useSelector((state: any) => state.service);
  const [name, setName] = useState(myInfo.name);
  const [bio, setBio] = useState(myInfo.bio || "");
  const [gender, setGender] = useState(myInfo.gender || "male");
  const [image, setImage] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(myInfo.avatar);
  const email = myInfo.email;

  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setImage(file);
    setAvatarPreview(URL.createObjectURL(file));
  };
  const [updateMyInfo, updateMyInfoData] = useUpdateMyInfoMutation();

  const handleSaveChanges = async () => {
    const formData = new FormData();
    const genderValue = gender.toLowerCase();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("gender", genderValue);
    if (image) {
      formData.append("avatar", image);
    }
    await updateMyInfo(formData).unwrap();

    // navigate sau khi mutation thành công và có user_id
    navigate(`/user/${myInfo.user_id}`);
  };

  useEffect(() => {
    if (updateMyInfoData.isLoading) toast.info("Đang cập nhật thông tin...", { autoClose: 1000 });
    if (updateMyInfoData.isSuccess) toast.success("Cập nhật thông tin thành công");
  }, [updateMyInfoData.isSuccess]);

  useEffect(() => {
    if (updateMyInfoData.isError) toast.error("Cập nhật thông tin thất bại");
  }, [updateMyInfoData.isError]);


  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        height: "100vh",
        borderRadius: 2,
        background: " #121212",
        transition: "background 0.5s ease-in-out",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Main content */}
      <Stack
        spacing={3}
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          py: 3,
          px: 2,
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        {/* Avatar + Bio */}
        <Stack direction="row" alignItems="flex-start" spacing={3}>
          <Box position="relative" sx={{ width: 120, height: 120 }}>
            <Avatar
              src={avatarPreview}
              alt="avatar"
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.1)",
              }}
            />
            <IconButton
              onClick={handleAvatarClick}
              sx={{
                position: "absolute",
                top: "35%",
                left: "35%",
                bgcolor: "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              }}
            >
              <PhotoCamera />
            </IconButton>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </Box>

          <Stack flex={1}>
            <TextField
              label="Giới thiệu"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              multiline
              rows={4}
              fullWidth
              inputProps={{ maxLength: 150 }}
              sx={{
                "& .MuiInputBase-root": { bgcolor: "#1E1E1E", color: "white" },
              }}
            />
            <Typography variant="caption" color="gray">
              {bio.length}/150
            </Typography>
          </Stack>
        </Stack>

        {/* Tên hiển thị + Email */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
        >
          <Stack flex={1}>
            <Typography variant="subtitle2" color="gray" mb={0.5}>
              TÊN HIỂN THỊ
            </Typography>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              sx={{
                "& .MuiInputBase-root": { bgcolor: "#1E1E1E", color: "white" },
              }}
            />
          </Stack>

          <Stack flex={1}>
            <Typography variant="subtitle2" color="gray" mb={0.5}>
              EMAIL
            </Typography>
            <TextField
              value={email}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-root": { bgcolor: "#1E1E1E", color: "gray" },
              }}
            />
          </Stack>
        </Stack>

        {/* Ngày sinh + Giới tính */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
        >
          <Stack flex={1}>
            <Typography variant="subtitle2" color="gray" mb={0.5}>
              GIỚI TÍNH
            </Typography>
            <RadioGroup
              row
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <FormControlLabel
                value="male"
                control={<Radio color="primary" />}
                label="Nam"
                sx={{ color: "white" }}
              />
              <FormControlLabel
                value="female"
                control={<Radio color="primary" />}
                label="Nữ"
                sx={{ color: "white" }}
              />
            </RadioGroup>
          </Stack>
        </Stack>

        {/* Nút lưu */}
        <Box textAlign="right" mt={2}>
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Lưu thay đổi
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}

export default EditProfile;
