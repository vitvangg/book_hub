import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";

function Error() {
  return <div>
    <Stack 
        width={"100%"}
        height={"100vh"}
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ background: 'url(./public/404_not.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
        <Stack>
            <Button variant="contained" href="/home" sx={{ bgcolor: "#1DB954", '&:hover': { border: "1px solid white" }, cursor: "pointer" }}>
                Go to Home
            </Button>
        </Stack>
    </Stack>
  </div>;
}

export default Error;