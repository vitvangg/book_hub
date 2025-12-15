import {
  Stack,
  Avatar,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useCreateFeedbackMutation } from "../../redux/service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const FeedbackPage = () => {
    const { myInfo } = useSelector((state: any) => state.service);
    const navigate = useNavigate();

    const [sendFeedback] = useCreateFeedbackMutation();
    const [message, setMessage] = useState("");

    const handleSaveChanges = async () => {
        try {
            await sendFeedback({ message }).unwrap();
            setMessage("");
            toast.success("Feedback sent successfully!");
            navigate("/home");
        } catch (error) {
            console.error("Failed to send feedback:", error);
        }
    };
    const handleCancel = () => {
        setMessage("");
        navigate("/home");
        toast.info("Feedback cancelled.");
    }
    
    return (
        <Stack
            sx={{
                width: "100%",
                height: "100vh",
                borderRadius: 2,
                background: " #121212",
                transition: "background 0.5s ease-in-out",
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
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
                <Stack direction="column" alignItems="center" spacing={2}>
                    <Stack direction={"row"} alignItems="center" spacing={2}>
                        <Box sx={{ width: 50, height: 50 }}>
                        <Avatar
                            src={myInfo.avatar}
                            alt="avatar"
                            sx={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                border: "2px solid rgba(255,255,255,0.1)",
                            }}
                            />
                        </Box>
                        <Stack direction="column" alignItems={"flex-start"}>
                            <Typography variant="h6" color="white" textAlign="center">
                                {myInfo.name}
                            </Typography>
                            <Typography variant="body2" color="gray" textAlign="center">
                                {myInfo.email}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack flex={1}>
                        <TextField
                        label="Your feedback"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        multiline
                        rows={7}
                        inputProps={{ maxLength: 500 }}
                        sx={{
                            "& .MuiInputBase-root": { bgcolor: "#1E1E1E", color: "white" },
                            width: "38rem",
                        }}
                        />
                        <Typography variant="caption" color="gray">
                        {message.length}/500
                        </Typography>
                    </Stack>
                </Stack>


                {/* Nút lưu */}
                <Box textAlign="center" mt={2}>
                <Button onClick={handleCancel}
                    sx={{
                    color: "#b3b3b3",
                    fontWeight: 600,
                    borderRadius: 2,
                    border: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        color: "white",
                        transform: "scale(1.03)", 
                    },
                    mr: 2
                }}>
                    Huỷ
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                    Gửi phản hồi
                </Button>
                </Box>
            </Stack>
        </Stack>
    );
};
