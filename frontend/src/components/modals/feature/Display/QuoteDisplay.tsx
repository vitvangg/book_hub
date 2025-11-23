import Box from "@mui/material/Box";

export default function QuoteDisplay({ block }: { block: any }) 
{
    return (
    <Box
        sx={{
            "&:empty:before": {
            content: "attr(data-placeholder)",
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
            },
            borderLeft: "4px solid #1db954",
            pl: 2,
            fontStyle: "italic",
            fontFamily: "Noto Serif",
            color: "white",
            fontSize: "19px",
            lineHeight: "32px",
            textAlign: "justify",
            width: "100%",
            maxWidth: 680,
            py: "7.6px",
            whiteSpace: "pre-wrap",
            mb: "20px",
            maxWight: "700px",
        }}>
            {block.content.quote}
    </Box>
    )
}