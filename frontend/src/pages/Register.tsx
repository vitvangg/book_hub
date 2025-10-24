import { Box, 
        Stack, 
        Typography, 
        TextField, 
        Button } from "@mui/material";
import { useState } from "react";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });

    const validateForm = () => {
        const newErrors = { email: "", password: "" };
        let isValid = true;

        if (!email.trim()) {
            newErrors.email = "Vui lòng nhập email";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email không hợp lệ";
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Vui lòng nhập mật khẩu";
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleRegister = () => {
        if (validateForm()) {
            console.log("Register data:", { email, password, timestamp: new Date().toLocaleString() });
            // TODO: Kết nối backend ở đây
        }
    }

    return <Box 
                sx={{
                    width: "100%",
                    height: "100vh", 
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { width: "0px" },
                    "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "4px",
                },
                }}>
        <Stack width={"100%"} 
                justifyContent={"flex-start"}
                alignItems={"center"} 
                direction={"column"} 
                sx={{ bgcolor: "#121212", pt: 8
            }}>   
            <Stack width={"30%"} justifyContent={"center"} alignItems={"center"} >
                { /* Left - Logo & Text */ }
                <Stack direction="column" alignItems="center" mt={6}>
                <img
                src="/logo_white.svg"
                alt="logo"
                style={{ width: 48, height: 48 }}
                />
                    <Typography
                    variant="h2"
                    sx={{
                        color: "white",
                        fontWeight: 800,
                        fontSize: "48px",
                        textAlign: "center",
                        lineHeight: 1.2,
                    }}
                    >
                    Sign up to<br />start Reading
                    </Typography>
                </Stack>

                { /* Input Form */ }
                <Stack direction="column" spacing={2} width={"75%"} sx={{ mt: 4 }}>
                    <Stack spacing={1}>
                        { /* Email */ }
                    <Typography
                    variant="h5"
                        sx={{
                            color: "white",
                            fontWeight: 700,
                            fontSize: "13px",
                            textAlign: "left",
                            lineHeight: 1.2,
                        }}>
                    Enter email
                    </Typography>
                    <TextField
                    error={!!errors.email}
                    placeholder="name@domain.com"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        height: "3rem",
                        bgcolor: "black",
                        borderRadius: "4px",
                        "& .MuiOutlinedInput-root": {
                        bgcolor: "transparent",
                        border: "1px solid #535353",
                        borderRadius: "4px",
                        transition: "all 0.3s ease-in-out",

                        "&:hover": {
                            borderColor: "white", // hover đổi màu viền
                        },
                        "&.Mui-focused": {
                            borderColor: "white", // khi focus đổi sang trắng
                        },
                        "& fieldset": { border: "none" }, // bỏ border mặc định
                        input: {
                            color: "white",
                            padding: "10px 12px",
                        },
                        },
                    }}
                    />
                    {errors.email && (
                        <Typography variant="caption" sx={{ color: "#ff4444", fontSize: "12px" }}>
                            {errors.email}
                        </Typography>
                    )}
                    </Stack>
                    <Stack spacing={1}>
                        { /* Enter password */}
                    <Typography
                    variant="h5"
                        sx={{
                            color: "white",
                            fontWeight: 700,
                            fontSize: "13px",
                            textAlign: "left",
                            lineHeight: 1.2,
                        }}>
                    Enter password
                    </Typography>
                    <TextField
                    placeholder="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    sx={{
                        height: "3rem",
                        bgcolor: "black",
                        borderRadius: "4px",
                        "& .MuiOutlinedInput-root": {
                        bgcolor: "transparent",
                        border: "1px solid #535353",
                        borderRadius: "4px",
                        transition: "all 0.3s ease-in-out",

                        "&:hover": {
                            borderColor: "white", // hover đổi màu viền
                        },
                        "&.Mui-focused": {
                            borderColor: "white", // khi focus đổi sang trắng
                        },
                        "& fieldset": { border: "none" }, // bỏ border mặc định
                        input: {
                            color: "white",
                            padding: "10px 12px",
                        },
                        },
                    }}
                    />
                    {errors.password && (
                        <Typography variant="caption" sx={{ color: "#ff4444", fontSize: "12px" }}>
                            {errors.password}
                        </Typography>
                    )}
                    </Stack>
                </Stack>

                { /* Button Sign up */ }
                <Stack direction="column" spacing={2} width={"75%"}  sx={{ mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={handleRegister}
                        sx={{
                            bgcolor: "#1DB954",
                            color: "black",
                            borderRadius: "9999px",
                            height: "3rem",
                            fontWeight: 700,
                            fontSize: "16px",
                            textTransform: "none",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                                bgcolor: "#1ed760",
                                cursor: "pointer"
                            },
                        }}
                    >
                        Sign up
                    </Button>
                </Stack>
                { /* Link to Login */ }
                <Stack direction="column" spacing={2} width={"75%"}  sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h5" sx={{ color: "white", fontWeight: 700, fontSize: "13px", textAlign: "center", lineHeight: 1.2 }}>
                        Already have an account? <a href="/login" style={{color: "#1DB954", textDecoration: "none"}}>Log in</a>
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    </Box>;
}

export default Register;
