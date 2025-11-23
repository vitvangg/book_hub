import { Box, Stack, Typography, Avatar } from "@mui/material";

export default function RenderReplies({ replies, level = 1 }: any) {
  if (!replies?.length) return null;

  return replies.map((r: any) => (
    <Box key={r.comment_id} sx={{ ml: level , mt: 1 }}>
      <Stack direction="row" spacing={1}>
        <Avatar src={r.user.avatar} sx={{ width: 28, height: 28 }} />
        <Box>
          <Typography fontWeight={500}>{r.user.name}</Typography>
          <Typography sx={{ color: "#ccc", fontSize: 14 }}>
            {r.content}
          </Typography>
        </Box>
      </Stack>

      {/* Đệ quy để render replies của replies */}
      <RenderReplies replies={r.replies} level={level + 1} />
    </Box>
  ));
}