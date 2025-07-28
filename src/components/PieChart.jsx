import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Box } from '@mui/material';

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};

const DonutChart = ({ data = [], title = '' }) => {
  // Check if there's at least one non-zero value
  const hasData = data.some(item => item.value > 0);

  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>{title}</Typography>

      {hasData ? (
        <PieChart
          sx={{ marginBottom: 2 }}
          series={[{ innerRadius: 50, outerRadius: 100, data }]}
          {...settings}
        />
      ) : (
        <Box
          sx={{
            width: settings.width,
            height: settings.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            border: '1px dashed grey',
            mx: 'auto',
            color: 'gray',
            fontSize: '0.9rem'
          }}
        >
          No data available
        </Box>
      )}
    </Box>
  );
};


export default DonutChart;
