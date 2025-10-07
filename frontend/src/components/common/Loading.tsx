import { Stack, CircularProgress } from "@mui/material";

function Loading() {
  return (
    <Stack flexDirection="row" justifyContent="center" alignItems="center" bgcolor={"white"}
      width={"100%"}
      height={"100%"}
      minHeight={"50vh"}
      >
      <CircularProgress sx={{ color: "#1db954" }} />
    </Stack>
  );
}
export default Loading;