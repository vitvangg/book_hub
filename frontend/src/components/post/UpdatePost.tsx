import {
  Box,
  Stack,
  Typography,
  Avatar,
  Divider,
  MenuItem,
  Chip,
  Button,
  InputBase,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from "@mui/material";
import { use, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { 
          useListTagQuery, 
          useListBlockByPostQuery, 
          useDeleteBlockMutation, 
          useUpdatePostDetailMutation, 
          useGetPostDetailQuery} from "../../redux/service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ChoiceType } from "../modals/common/ChoiceType";
import TextUpdate from "../modals/feature/Update/UpdateText";
import CreateImage from "../modals/feature/Create/CreateImageBlock";
import CreateQuote from "../modals/feature/Create/CreateQuote";
import CreateText from "../modals/feature/Create/CreateText";
import QuoteUpdate from "../modals/feature/Update/UpdateQuote";
import TextDisplay from "../modals/feature/Display/TextDisplay";
import QuoteDisplay from "../modals/feature/Display/QuoteDisplay";
import ImageDisplay from "../modals/feature/Display/ImageDisplay";

type BlockType = {
  block_id: string;
  content: {
    text?: string;
    image?: string;
    caption?: string;
    quote?: string;
  };
  type?: string;
  order_index?: number;
};

export default function UpdatePost() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { postID } = useParams();

  const { data: post } = useGetPostDetailQuery(String(postID));

  const [title, setTitle] = useState(post?.post.title || "");
  const [quoteTitle, setQuoteTitle] = useState(post?.post.quote || "");

  const [listBlock, setListBlock] = useState<BlockType[]>([]);

  useEffect(() => {
    setListBlock(post?.post.blocks || []);
  }, [post]);

  const [prevListLength, setPrevListLength] = useState(0);
  const navigate = useNavigate();

  const { myInfo } = useSelector((state: any) => state.service);

  // danh sach tag
  const { data: tagsData } = useListTagQuery();
  const tagsArray = tagsData?.tags ?? [];

  if (!tagsArray) {
    console.error("Failed to load tags");
    return null;
  }

  const [selectedTagIDs, setSelectedTagIDs] = useState<number[]>([]);

  useEffect(() => {
    setSelectedTagIDs(post?.post.tags.map((tag: any) => tag.tag_id) || []);
  }, [post?.post.tags]);

  const currentUser = {
    name:  myInfo.name,
    avatar: myInfo.avatar,
  };
  const listBlockData = useListBlockByPostQuery(String(postID));

  const [deleteBlock] = useDeleteBlockMutation();

  const [updatePostDetail, { isLoading: isUpdating, isError }] = useUpdatePostDetailMutation();
  const [currentType, setCurrentType] = useState<"text" | "image" | "quote">("text");

  const handleUpdatePost = async () => {
    try {
      await updatePostDetail({
        postID,
        title,
        quote: quoteTitle,
        tagIDs: selectedTagIDs,
      }).unwrap();
      toast.success("Updated successfully!");
      navigate(`/post/${postID}`);
    } catch (error) {
      toast.error("Failed to update post");
    }
  };
  const handleCancel = () => {
    navigate(`/post/${postID}`);
  }

  useEffect(() => {
    if (isError){
      toast.error("Failed to update post");
    }
  }, [isError]);
  useEffect(() => {
    toast.info("Nếu như bạn đã sửa block thì block sẽ được lưu ngay lập tức kể cả khi bạn cancel khỏi chế độ sửa. Nên hãy dảm bảo mọi thứ đúng ý bạn trước khi ấn Update Post hay Cancel.",
    { autoClose: 10000 }
    );
  }, []);

  async function handleCreateMidBlock(currentIndex: number) {
    const blocks = [...listBlock].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const currentPos = blocks.findIndex(b => b.order_index === currentIndex);
    const nextBlock = blocks[currentPos + 1];
    const nextOrder = nextBlock ? nextBlock.order_index! : currentIndex + 1;
    const newOrder = (currentIndex + nextOrder) / 2; // 💡 trung bình
    console.log("New order index:", newOrder);

    const newBlock = {
      block_id: crypto.randomUUID(),
      type: "text",
      order_index: newOrder,
      isNew: true,
      content: { text: "" },
    };
    setListBlock(prev => {
      const index = prev.findIndex(b => b.order_index === currentIndex);
      const newList = [...prev];
      newList.splice(index + 1, 0, newBlock); // chèn sau block hiện tại
      return newList;
    });
  }


  async function handleDelete(block_id: string) {
      try {
        await deleteBlock(block_id).unwrap();
        setListBlock(prev => prev.filter(b => b.block_id !== block_id)); // cập nhật UI
      } catch (error) {
        console.error("Failed to delete block:", error);
      }
  }

    function handleUpdate(block_id: string) {
      setListBlock(prev =>
        prev.map(b =>
          b.block_id === block_id ? { ...b, isEditing: true } : b
        )
      );
    }
      const scrollToBottom = () => {
          setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
          });
            }
          }, 100); 
      };
      useEffect(() => {
        if (listBlock.length > prevListLength && listBlock.length > 0) {
          scrollToBottom();
        }
        setPrevListLength(listBlock.length);
      }, [listBlock.length, prevListLength]);
  useEffect(() => {
    setPrevListLength(listBlock.length);
  }, [listBlock.length, prevListLength]);

  useEffect(() => {
    if (listBlockData.data && listBlockData.data.blocks) {
      setListBlock(listBlockData.data.blocks);
    }
  }, [listBlockData.data]);

  useEffect(() => {
    if (post?.post) {
      setTitle(post.post.title);
      setQuoteTitle(post.post.quote);
      setSelectedTagIDs(post.post.tags.map((tag: any) => tag.tag_id) || []);
    }
  }, [post]);
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100vh",
        borderRadius: 2,
        background: "#121212",
        color: "white",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.2)",
          borderRadius: "4px",
        },
      }}
    >
      {/* Khu vực cuộn nội dung */}
      <Box
        sx={{
          flex: 1,
          px: 4,
          paddingY: "7.6px",
          width: "700px",
          mt: 4,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* Nội dung chính */}
          <Box sx={{ width: "100%" }}>
            {/* Chủ đề */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="tag-select-label" sx={{color: "white", borderColor: "white"}}>Chủ đề</InputLabel>
              <Select
                labelId="tag-select-label"
                multiple
                value={selectedTagIDs}
                onChange={(e) => setSelectedTagIDs(e.target.value as number[])}
                input={<OutlinedInput label="Chủ đề" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as number[]).map((id) => {
                      const tag = tagsArray.find((t: any) => t.tag_id === id);
                      return <Chip key={id} label={tag?.name} sx={{ color: "white" }} />;
                    })}
                  </Box>
                )}
              >
                {tagsArray.map((tag: any) => (
                  <MenuItem key={tag.tag_id} value={tag.tag_id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="column" spacing={2} mb={2}>
            {/* Tiêu đề */}
            <InputBase
              multiline
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              sx={{
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 2,
                outline: 'none',
                border: 'none',
                cursor: 'text',
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.4)',
                },
              }}
            />


            {/* Trích dẫn */}
            <InputBase
              multiline
              value={quoteTitle}
              onChange={(e) => setQuoteTitle(e.target.value)}
              placeholder="Nhập trích dẫn bài viết..."
              sx={{
                fontStyle: "italic",
                color: "rgba(255,255,255,0.6)",
                fontSize: "16px",
                outline: "none",
                border: "none",
                mb: 3,
                position: "relative",
                "&:empty::before": {
                  content: "'Enter quote here...'",
                  color: "rgba(255,255,255,0.4)",
                  pointerEvents: "none",
                },
              }}
            />  
            </Stack>
            {/* Thông tin tác giả */}
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
              <Avatar
                src={currentUser.avatar}
                alt="Author"
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography fontWeight={600}>{currentUser.name}</Typography>
                {/* <Typography color="gray" variant="body2">
                  Hôm qua
                </Typography> */}
              </Box>
            </Stack>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 4 }} />

            {/* Nội dung bài viết */}
            <Box>
              {/* Nội dung bài viết */}
              <Stack alignContent={"center"} mb={20}> 
                  <Stack spacing={2} sx={{ mt: 4 }}>
                    {listBlock.map((block: any) => (
                      <Stack direction="row" 
                      key={block.block_id}
                      >
                        {block.isEditing ? (
                          block.type === "text" ? (
                          <TextUpdate
                            postID={postID}
                            blockID={block.block_id}
                            defaultValue={block.content.text}
                            onDone={(newText: string) => {
                              setListBlock(prev =>
                                prev.map(b =>
                                  b.block_id === block.block_id
                                    ? { ...b, isEditing: false, content: { text: newText } }
                                    : b
                                )
                              );
                            }}
                            onCancel={() => {
                              setListBlock(prev =>
                                prev.map(b =>
                                  b.block_id === block.block_id
                                    ? { ...b, isEditing: false }
                                    : b
                                )
                              );
                            }}
                          />) : block.type === "quote" ? (
                          <QuoteUpdate
                            postID={postID}
                            blockID={block.block_id}
                            defaultValue={block.content.quote}
                            onDone={(newText: string) => {
                              setListBlock(prev =>
                                prev.map(b =>
                                  b.block_id === block.block_id
                                    ? { ...b, isEditing: false, content: { quote: newText } }
                                    : b
                                )
                              );
                            }}
                            onCancel={() => {
                              setListBlock(prev =>
                                prev.map(b =>
                                  b.block_id === block.block_id
                                    ? { ...b, isEditing: false }
                                    : b
                                )
                              );
                            }}
                          />
                        ) : (
                          <Stack direction={"row"}>
                            {currentType === "text" && <CreateText order_index={listBlock.length + 1}/>}
                            {currentType === "image" && <CreateImage order_index={listBlock.length + 1}/>}
                            {currentType === "quote" && <CreateQuote order_index={listBlock.length + 1}/>}
                            <ChoiceType
                              mode="create"
                              onSelectType={(type: string) => setCurrentType(type as "text" | "image" | "quote")}
                            />
                          </Stack>
                        )) : (
                          <Stack spacing={2} sx={{ mt: 4 }}>
                              <Stack key={block.block_id} direction="row" spacing={2} alignItems="flex-start">
                                
                                {/* Nội dung giới hạn 700px */}
                                <Box sx={{ maxWidth: 700, width: "100%" }}>
                                  {block.type === "text" && <TextDisplay block={block} />}
                                  {block.type === "quote" && <QuoteDisplay block={block} />}
                                  {block.type === "image" && <ImageDisplay block={block} />}
                                </Box>

                                {/* ChoiceType luôn ngoài khung 700px */}

                                <Box>
                                  {block.type === "image" ? (
                                    <ChoiceType
                                      mode="manage"
                                      onDeleteBlock={() => handleDelete(block.block_id)}
                                      onUpdateBlock={() => handleUpdate(block.block_id)}
                                      onCreateBlock={() => handleCreateMidBlock(block.order_index!)}
                                      isImage={true}
                                    />
                                  ) : (
                                    <ChoiceType
                                      mode="manage"
                                      onDeleteBlock={() => handleDelete(block.block_id)}
                                      onUpdateBlock={() => handleUpdate(block.block_id)}
                                      onCreateBlock={() => handleCreateMidBlock(block.order_index!)}
                                    />
                                  )}
                                </Box>
                              </Stack>
                            
                          </Stack>
                        )}

                      </Stack>
                    ))}
                  </Stack>
                {/* <BlockPost /> */}
                <Stack direction={"row"}>
                  <Box width={"700px"}>
                    {currentType === "text" && <CreateText order_index={listBlock.length + 1}/>}
                    {currentType === "image" && <CreateImage order_index={listBlock.length + 1}/>}
                    {currentType === "quote" && <CreateQuote order_index={listBlock.length + 1}/>}
                  </Box>
                  <Box>
                    <ChoiceType
                      mode="create"
                      onSelectType={(type: string) => setCurrentType(type as "text" | "image" | "quote")}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Box>
            {/* Nút tạo bài viết */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, ml:4 }}>
              <Button
                onClick={handleCancel}
                sx={{
                  color: "#b3b3b3",
                  fontWeight: 600,
                  borderRadius: 2,
                  border: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "white",
                    transform: "scale(1.03)", // to ra khoảng 3%
                },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdatePost}
                sx={{
                  background: "#1db954",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": { background: "#1ed760" },
                }}
              >
                Update Post
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
