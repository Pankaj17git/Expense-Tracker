
import ReactECharts from 'echarts-for-react';
const ExpensePieChart = () => {
  const option = { 
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        name: 'Expenses',
        type: 'pie',
        radius: ['0%', '70%'],
        center: ['50%', '50%'],
        roseType: 'radius',
        label: {
          color: 'black',
          fontSize: 14,
          formatter: '{b}'
        },
        labelLine: {
          lineStyle: {
            color: 'black'
          },
          length: 10,
          length2: 20
        },
        data: [
          { value: 40, name: 'Travel', itemStyle: { color: '#FFA500' } },
          { value: 25, name: 'Shopping', itemStyle: { color: '#87CEFA' } },
          { value: 15, name: 'Misc', itemStyle: { color: '#F08080' } },
          { value: 12, name: 'General Expenses', itemStyle: { color: '#DDA0DD' } },
          { value: 10, name: 'Utilities', itemStyle: { color: '#20B2AA' } },
        ]
      }
    ]
  };

  return (
    <>
      < ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
      />
    </>
  );
};

export default ExpensePieChart;
