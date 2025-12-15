import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Pagination,
  Avatar,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useListFeedbackQuery } from "../../redux/service";
import { useState } from "react";

export default function FeedBackList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [openDialog, setOpenDialog] = useState<{
    open: boolean;
    message?: string;
  }>({ open: false, message: "" });
  const currentPage = Number(searchParams.get("page")) || 1;
  const { data: feedbacks } = useListFeedbackQuery({ page: currentPage });
  console.log(feedbacks);

  let currentFeedbacks = feedbacks?.data.feedbacks || [];
  console.log(currentFeedbacks);

  let totalFeedbackPages = feedbacks?.data.totalPages || 1;

  const handlePageChange = (_e: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", value.toString());
    setSearchParams(params);
  };

  const handleClick = (message: string) => {
    setOpenDialog({ open: true, message });
  };

  const handleCancel = () => {
    setOpenDialog({ open: false, message: "" });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        borderRadius: 2,
        background: " #121212",
        transition: "background 0.5s ease-in-out",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Khu vực cuộn nội dung */}
      <Box
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
        {/* --- Phần nội dung --- */}
        <Stack spacing={2}>
            {/* --- Phần danh sách feedback --- */}

        {currentFeedbacks.length === 0 ? (
          <Box sx={{ color: "white", textAlign: "center", mt: 5 }}>
            Không có phản hồi nào.
          </Box>
        ) : (
          currentFeedbacks.map((feedback: any) => (
            <Stack direction="column" spacing={1} 
                onClick={() => handleClick(feedback.message)}
                sx={{ padding: 2, backgroundColor: '#212121', color: 'white', borderRadius: 2, mb: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" >
                    <Avatar src={feedback.user.avatar} alt={feedback.user.name} />
                    <Typography variant="body2" fontWeight={500}>
                        {feedback.user.name}
                    </Typography>
                </Stack>
                <Box key={feedback.feedback_id}   sx={{
                    color: "white",
                    pl: 7,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                    {feedback.message}
                </Box>
            </Stack>
          ))
        )}
        {/* --- Phần phân trang --- */}
        <Stack alignItems="center" mt={3}>
          <Pagination
            count={totalFeedbackPages || 1}
            page={currentPage}
            onChange={handlePageChange}
            size="large"
            siblingCount={1}
            boundaryCount={1}
              sx={{
                color: "white",
                "& .MuiPaginationItem-root": {
                  color: "white", // 🎨 màu chữ
                  "&:hover": {
                    bgcolor: "#1db954", // 🎨 màu khi hover
                  },
                  "&.Mui-selected": {
                    bgcolor: "white", // 🎨 màu nút đang chọn
                    color: "#121212", // 🎨 màu chữ nút đang chọn
                  },
                },
              }}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog.open}
        onClose={handleCancel}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "#1a1a1a",
            color: "white",
            border: "1px solid #333",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", borderBottom: "1px solid #333" }}>
          FeedBack chi tiết
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography sx={{ color: "#ccc" }}>{openDialog.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #333", pt: 2 }}>
          <Button
            onClick={handleCancel}
            sx={{
              color: "#ccc",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            Off
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
