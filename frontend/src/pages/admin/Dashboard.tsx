import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { useOverviewQuery, usePost24hQuery, useUser24hQuery, useComment24hQuery } from '../../redux/service';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TotalCard from '../../components/common/TotalCard';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';
import { Paper, Typography } from '@mui/material';

function DashboardPage () {
    const { data: overviewData } = useOverviewQuery();
    const { data: post24hData } = usePost24hQuery();
    const { data: user24hData } = useUser24hQuery();
    const { data: comment24hData } = useComment24hQuery();
    
    const maxData = Math.max(
        user24hData?.userCount ?? 0,
        post24hData?.postCount ?? 0,
        comment24hData?.commentCount ?? 0
    )
    const maxCount = (maxData > 10) ? (maxData + 1 ) : 10

    useEffect(() => {
        console.log('Overview Data:', overviewData);
        console.log('Post 24h Data:', post24hData);
        console.log('User 24h Data:', user24hData);
        console.log('Comment 24h Data:', comment24hData);
    }, [overviewData, post24hData, user24hData, comment24hData, maxCount]);
    return (
        <>
        <Box
            sx={{
                width: "100%",
                height: "100vh",
                borderRadius: 2,
                background: " #121212",
                transition: "background 0.5s ease-in-out",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
        }}>
        {/* Khu vực cuộn nội dung */}
            <Box
                sx={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                py: 3,
                px: 2,
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "4px",
                },
                }}
            >
<Stack direction="row" spacing={2}>
  <TotalCard
    title="Users"
    total={overviewData?.userCount ?? 0}
    icon={<PeopleIcon sx={{ color: '#90caf9', fontSize: 28 }} />}
    color="#90caf9"
  />
  <TotalCard
    title="Posts"
    total={overviewData?.postCount ?? 0}
    icon={<ArticleIcon sx={{ color: '#a5d6a7', fontSize: 28 }} />}
    color="#a5d6a7"
  />
  <TotalCard
    title="Comments"
    total={overviewData?.commentCount ?? 0}
    icon={<CommentIcon sx={{ color: '#ffcc80', fontSize: 28 }} />}
    color="#ffcc80"
  />
</Stack>
<Paper
  elevation={0}
  sx={{
    background: 'linear-gradient(180deg, #1e1e1e, #141414)',
    borderRadius: 3,
    p: 3,
    border: '1px solid #2a2a2a',
  }}
>
  {/* Title */}
  <Typography
    variant="subtitle2"
    sx={{
      color: '#b0b0b0',
      textTransform: 'uppercase',
      letterSpacing: 1,
      mb: 2,
    }}
  >
    New in last 24 hours
  </Typography>

  {/* Accent glow */}
  <Box
    sx={{
      position: 'absolute',
      top: -40,
      right: -40,
      width: 160,
      height: 160,
      background: '#90caf9',
      opacity: 0.12,
      filter: 'blur(60px)',
      pointerEvents: 'none',
    }}
  />

  <BarChart
    xAxis={[{ data: ['Users', 'Posts', 'Comments'] }]}
    yAxis={[
      {
        min: 0,
        max: maxCount,
        tickNumber: 6,
        valueFormatter: (v: any) => v.toFixed(0),
      },
    ]}
    series={[
      {
        data: [
          user24hData?.userCount ?? 0,
          post24hData?.postCount ?? 0,
          comment24hData?.commentCount ?? 0,
        ],
        color: '#90caf9',
      },
    ]}
    height={280}
    sx={{
      // chữ trục
      '& .MuiChartsAxis-tickLabel': {
        fill: '#e0e0e0',
        fontSize: 12,
      },

      // đường trục
      '& .MuiChartsAxis-line': {
        stroke: '#666',
      },

      // tick
      '& .MuiChartsAxis-tick': {
        stroke: '#666',
      },

      // grid
      '& .MuiChartsGrid-line': {
        stroke: '#2a2a2a',
      },
    }}
  />
</Paper>
            </Box>
        </Box>
        </>
    )
}

export default DashboardPage;


