import { Box, Typography } from "@mui/material";

export default function ImageDisplay({ block }: { block: any }) {
  return (
    <Box textAlign="center">
      {block.content.image && (
        <Box display="inline-block" textAlign="center" ml="30px">
          <img
            src={block.content.image}
            alt="image"
            style={{
              width: "100%",
              maxWidth: 640,
              maxHeight: 360,
              objectFit: "cover",
              borderRadius: 8,
              display: "block",
            }}
          />
        </Box>
      )}

      {block.content.caption && (
        <Typography
            variant="body1"
            sx={{
            mt: 1.5,
            color: "white",
            fontSize: "13px",
            textShadow: "0 0 2px rgba(0,0,0,0.6)",
            fontWeight: 400,
        }}>
            {block.content.caption}
        </Typography>
      )}
    </Box>
  );
}
