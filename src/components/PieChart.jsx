import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Box } from '@mui/material';

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};

const DonutChart = ({ data = [], title = '' }) => {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>{title}</Typography>
      <PieChart
        sx={{ marginBottom: 2 }}
        series={[{ innerRadius: 50, outerRadius: 100, data }]}
        {...settings}
      />
    </Box>
  );
};

export default DonutChart;
