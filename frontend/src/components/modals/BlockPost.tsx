import { Box, IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Quote } from "./feature/Quote";
import LoadImage from "./feature/LoadImage";
import TextDefault from "./feature/TextDefault";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import ImageIcon from "@mui/icons-material/Image";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import AbcIcon from "@mui/icons-material/Abc";

type BlockType = "text" | "quote" | "image";

interface Block {
  id: number;
  type: BlockType;
  content: string;
}

export interface BlockPostRef {
  exportToMarkdown: () => string;
  exportBlocksData: () => { blocks: Block[]; markdown: string };
  importBlocksData: (blocks: Block[]) => void;
  importFromMarkdown: (markdown: string) => void;
}

export default forwardRef<BlockPostRef>((_props, ref) => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: Date.now(), type: "text", content: "" },
  ]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // Tạo block mới ngay dưới block hiện tại
  const handleEnter = (id: number) => {
    const index = blocks.findIndex((b) => b.id === id);
    const newBlock: Block = { id: Date.now(), type: "text", content: "" };
    setBlocks((prev) => [
      ...prev.slice(0, index + 1),
      newBlock,
      ...prev.slice(index + 1),
    ]);
  };

  // cap nhat noi dung block
  const updateBlockContent = (id: number, content: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
  };
  // Đổi kiểu block hiện tại
  const changeBlockType = (id: number, type: BlockType) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, type } : b)));
    setOpenMenu(null);
  };

  // Xoá block
  const handleDelete = (id: number) => {
    if (blocks.length === 1) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Convert blocks to markdown
  const exportToMarkdown = () => {
    return blocks
      .map((block) => {
        switch (block.type) {
          case "text":
            return block.content;
          case "quote":
            return `> ${block.content}`;
          case "image":
            return `![Image](${block.content})`;
          default:
            return block.content;
        }
      })
      .join("\n\n");
  };

  // Export blocks structure để có thể edit lại
  const exportBlocksData = () => {
    return {
      blocks: blocks,
      markdown: exportToMarkdown(),
    };
  };

  // Import từ blocks data
  const importBlocksData = (blocksData: Block[]) => {
    setBlocks(blocksData);
  };

  // Parse markdown thành blocks (basic implementation)
  const importFromMarkdown = (markdown: string) => {
    const lines = markdown.split("\n\n");
    const newBlocks: Block[] = lines.map((line, index) => {
      if (line.startsWith("> ")) {
        return {
          id: Date.now() + index,
          type: "quote" as BlockType,
          content: line.substring(2),
        };
      } else if (line.startsWith("![")) {
        // Parse image markdown
        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
        const caption = match?.[1] || "";
        const url = match?.[2] || "";
        return {
          id: Date.now() + index,
          type: "image" as BlockType,
          content: `${url}|${caption}`,
        };
      } else {
        return {
          id: Date.now() + index,
          type: "text" as BlockType,
          content: line,
        };
      }
    });

    setBlocks(newBlocks);
  };

  // Forward ref methods
  useImperativeHandle(ref, () => ({
    exportToMarkdown,
    exportBlocksData,
    importBlocksData,
    importFromMarkdown,
  }));

  return (
    <Box>
      {blocks.map((block) => (
        <Stack
          direction={"row"}
          alignItems="center"
          justifyContent="space-between"
          key={block.id}
          sx={{
            position: "relative",
            borderRadius: 1,
            width: "120%",
          }}
        >
          {/* Nội dung block */}
          {block.type === "text" && (
            <TextDefault
              onEnter={() => handleEnter(block.id)}
              content={block.content || ""}
              onContentChange={(content) =>
                updateBlockContent(block.id, content)
              }
            />
          )}
          {block.type === "quote" && (
            <Quote
              onEnter={() => handleEnter(block.id)}
              content={block.content || ""}
              onContentChange={(content) =>
                updateBlockContent(block.id, content)
              }
            />
          )}
          {block.type === "image" && (
            <LoadImage
              onEnter={() => handleEnter(block.id)}
              content={block.content || ""}
              onContentChange={(content) =>
                updateBlockContent(block.id, content)
              }
            />
          )}
          {/* Nút chỉnh block hiện tại */}
          <Box sx={{ display: "flex", flexDirection: "row", ml: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="small"
                onClick={() =>
                  setOpenMenu(openMenu === block.id ? null : block.id)
                }
                sx={{
                  color: "gray",
                  "&:hover": { color: "#1db954" },
                }}
              >
                <AddBoxRoundedIcon fontSize="small" />
              </IconButton>

              {openMenu === block.id && (
                <Stack direction="row" sx={{ ml: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => changeBlockType(block.id, "text")}
                    sx={{ color: "gray", "&:hover": { color: "#1db954" } }}
                  >
                    <AbcIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => changeBlockType(block.id, "quote")}
                    sx={{ color: "gray", "&:hover": { color: "#1db954" } }}
                  >
                    <FormatQuoteIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => changeBlockType(block.id, "image")}
                    sx={{ color: "gray", "&:hover": { color: "#1db954" } }}
                  >
                    <ImageIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}
            </Box>
            {/* Nút xoá */}
            <IconButton
              size="small"
              onClick={() => handleDelete(block.id)}
              sx={{
                color: "gray",
                "&:hover": { color: "red" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Stack>
      ))}
    </Box>
  );
});
