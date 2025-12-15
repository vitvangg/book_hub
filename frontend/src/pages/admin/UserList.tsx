import { Box, Stack, Pagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDeleteUserMutation, useListUserQuery } from "../../redux/service";
import UserCard from "../../components/common/UserCard";
import { useState } from "react";

export default function UserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId: number | null; userName: string }>({ open: false, userId: null, userName: "" });

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Number(pageParam) : 1;
  const { data: user } = useListUserQuery({ page: currentPage });
  const [deleteUser] = useDeleteUserMutation();

  let currentUsers = user?.data.users || [];
  console.log("Current Users:", currentUsers);
  let totalUserPages = user?.data.totalPages || 1;

  const handlePageChange = (_e: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", value.toString());
    setSearchParams(params);
  };

  const handleUserClick = (userID: number) => {
    navigate(`/user/${userID}`);
  };

  const handleDeleteClick = (userID: number, userName: string) => {
    setDeleteDialog({ open: true, userId: userID, userName });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(deleteDialog.userId).unwrap();
      setDeleteDialog({ open: false, userId: null, userName: "" });
      // Có thể thêm toast success message ở đây
    } catch (error) {
      console.error("Failed to delete user:", error);
      setDeleteDialog({ open: false, userId: null, userName: "" });
      // Có thể thêm toast error message ở đây
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, userId: null, userName: "" });
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
        {/* --- Phần nội dung người dùng --- */}
        <Stack direction={"row"} spacing={2}>
          <Box sx={{ flex: 8 }}>
            <Box>
              {/* --- Nội dung từng tab --- */}
              {currentUsers.length === 0 ? (
                <Box sx={{ color: "white", textAlign: "center", mt: 5 }}>
                  Không có người dùng nào.
                </Box>
              ) : (
                <>
                  {currentUsers.map((user: any) => (
                    <Stack direction={"row"} key={user.user_id}>
                      <Box sx={{ flex: 1}}>
                        <UserCard
                          name={user.name}
                          avatar={user.avatar}
                          onClick={() => handleUserClick(user.user_id)}
                        />
                      </Box>
                      <Box>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          onClick={() => handleDeleteClick(user.user_id, user.name)}
                          sx={{ mt: 1, ml: 2, borderColor: 'red', color: 'red'}}
                        >
                          Xóa người dùng
                        </Button>
                      </Box>
                    </Stack>
                  ))}

                  {/* --- Phân trang người dùng --- */}
                  <Stack alignItems="center" mt={3}>
                    <Pagination
                      count={totalUserPages || 1} // tổng số trang người dùng
                      page={currentPage} // page hiện tại
                      onChange={handlePageChange} // hàm đổi trang
                      size="large"
                      siblingCount={1}
                      boundaryCount={1}
                      sx={{
                        color: "white",
                        "& .MuiPaginationItem-root": {
                          color: "white",
                          "&:hover": { bgcolor: "#1db954" },
                          "&.Mui-selected": {
                            bgcolor: "white",
                            color: "#121212",
                          },
                        },
                      }}
                    />
                  </Stack>
                </>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={handleDeleteCancel}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "#1a1a1a",
            color: "white",
            border: "1px solid #333"
          }
        }}
      >
        <DialogTitle sx={{ color: "white", borderBottom: "1px solid #333" }}>
          Xác nhận xóa người dùng
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography sx={{ color: "#ccc" }}>
            Bạn có chắc chắn muốn xóa người dùng <strong style={{color: "white"}}>{deleteDialog.userName}</strong>?
            <br /><br />
            <span style={{color: "#ff6b6b"}}>
              ⚠️ Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu của người dùng.
            </span>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #333", pt: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{ 
              color: "#ccc",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ 
              bgcolor: "#ff4444", 
              "&:hover": { bgcolor: "#ff6666" }
            }}
          >
            Xóa người dùng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}