import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function TotalCard({
  total = 0,
  title = '',
  icon,
  color = '#90caf9',
}: {
  total?: number;
  title?: string;
  icon?: React.ReactNode;
  color?: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        background: 'linear-gradient(135deg, #1e1e1e, #151515)',
        borderRadius: 3,
        p: 3,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #2a2a2a',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 30px ${color}22`,
        },
      }}
    >
      {/* Accent blur */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          background: color,
          opacity: 0.15,
          filter: 'blur(40px)',
        }}
      />

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: '#b0b0b0',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              mb: 0.5,
            }}
          >
            {title}
          </Typography>

          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {total}
          </Typography>
        </Box>

        {icon && (
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: `${color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default TotalCard;
