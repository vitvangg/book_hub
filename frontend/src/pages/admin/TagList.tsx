import { Chip, Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button, InputBase } from "@mui/material";
import Box from "@mui/material/Box";
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreateTagMutation, useDeleteTagMutation, useListTagQuery } from "../../redux/service";
import { useState } from "react";

export function TagList() {
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; tagId: number | null; tagName: string }>({ open: false, tagId: null, tagName: "" });
    const [createDialog, setCreateDialog] = useState(false);
    const [newTagName, setNewTagName] = useState("");

    const { data } = useListTagQuery();
    const tagsArray = data?.tags ?? [];

    const [deleteTag] = useDeleteTagMutation();
    const [createTag] = useCreateTagMutation();

    const handleDeleteClick = (tagId: number, tagName: string) => {
        setDeleteDialog({ open: true, tagId, tagName });
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteTag(deleteDialog.tagId).unwrap();
            setDeleteDialog({ open: false, tagId: null, tagName: "" });
        } catch (error) {
            console.error("Failed to delete tag:", error);
            setDeleteDialog({ open: false, tagId: null, tagName: "" });
        }
    };
    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, tagId: null, tagName: "" });
    }

    const handleClick = () => {
        setCreateDialog(true);
    };
    const handleCreateCancel = () => {
        setCreateDialog(false);
        setNewTagName("");
    }
    const handleCreateConfirm = async () => {
        try {
            await createTag({ name: newTagName }).unwrap();
            setCreateDialog(false);
            setNewTagName("");
        } catch (error) {
            console.error("Failed to create tag:", error);
            setCreateDialog(false);
            setNewTagName("");
        }
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
          justifyContent: "center",
          alignItems: "center",
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
        <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap", // cho phép xuống dòng
            gap: 1,          // khoảng cách giữa các chip
            maxWidth: 600,   // điều chỉnh để mỗi dòng ~3–4 chip
        }}
        >
        {tagsArray.map((tag: any) => (
            <Chip
            key={tag.tag_id}
            label={tag.name}
            onDelete={() => handleDeleteClick(tag.tag_id, tag.name)}
            deleteIcon={<DeleteIcon />}
            color="success"
            sx={{ color: "black"}}
            />
        ))}

        {/* Nút Add tag */}
        <Chip 
            label="+ Add Tag" 
            clickable 
            color="primary" 
            onClick={handleClick} 
        />
        </Box>

        {/* Xác nhận xóa tag dùng Dialog */}
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
                Xác nhận xóa tag
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Typography sx={{ color: "#ccc" }}>
                Bạn có chắc chắn muốn xóa tag <strong style={{color: "white"}}>{deleteDialog.tagName}</strong>?
                <br /><br />
                <span style={{color: "#ff6b6b"}}>
                    ⚠️ Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu của tag.
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
                Xóa tag
                </Button>
            </DialogActions>
        </Dialog>
        {/* Tạo tag mới Dialog */}
        <Dialog 
          open={createDialog} 
          onClose={handleCreateCancel}
            sx={{
            "& .MuiDialog-paper": {
              bgcolor: "#1a1a1a",
              color: "white",
              border: "1px solid #333"
            }
          }}>
            <DialogTitle sx={{ color: "white", borderBottom: "1px solid #333" }}>
                Tạo tag mới
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <InputBase
                    value={newTagName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTagName(e.target.value)}
                    placeholder="Nhập tên tag..."
                    sx={{
                        "&:empty:before": {
                            content: "attr(data-placeholder)",
                            color: "rgba(255,255,255,0.4)",
                        },
                        color: "white",
                        outline: "none",
                        fontSize: 19,
                        py: "7.6px",
                        width: "100%",
                        whiteSpace: "pre-wrap",
                    }}
                />
          </DialogContent>
          <DialogActions sx={{ borderTop: "1px solid #333", pt: 2 }}>
                <Button 
                onClick={handleCreateCancel}
                sx={{ 
                    color: "#ccc",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
                }}
                >
                Hủy
                </Button>
                <Button 
                onClick={handleCreateConfirm}
                color="primary"
                variant="contained"
                sx={{ 
                    bgcolor: "#007bff", 
                    "&:hover": { bgcolor: "#0056b3" }
                }}
                >
                Tạo tag
                </Button>
            </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
