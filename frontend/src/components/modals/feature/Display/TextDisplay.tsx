import Box from "@mui/material/Box";

export default function TextDisplay({ block }: { block: any }) 
{
    return (
    <Box
        sx={{
            "&:empty:before": {
            content: "attr(data-placeholder)",
            color: "rgba(255,255,255,0.4)",
            },
            outline: "none",
            color: "white",
            fontSize: 19,
            py: "7.6px",
            width: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            lineHeight: "32px",
            maxWidth: "700px",

        }}>
            {block.content.text}
    </Box>
    )
}