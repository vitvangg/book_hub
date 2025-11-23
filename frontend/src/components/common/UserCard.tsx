import {
  Typography,
  Stack,
  Avatar,
  Tooltip
} from "@mui/material";

interface UserCardProps {
  avatar: string;
  name: string;
  onClick?: () => void;
}

export default function UserCard({
  avatar = "/meme.jpg",
  name,
  onClick
}: UserCardProps) {
  return (
    <Tooltip title={name} arrow onClick={onClick}>
       <Stack direction="row" spacing={2} alignItems="center" sx={{ cursor: onClick ? 'pointer' : 'default', padding: 1, backgroundColor: '#212121', color: 'white', borderRadius: 2, mb: 1 }}>
         <Avatar src={avatar} alt={name} />
         <Typography variant="body2" fontWeight={500}>
           {name}
         </Typography>
       </Stack>
    </Tooltip>
  );
}
