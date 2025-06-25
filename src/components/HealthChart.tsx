import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockStepsData = [
  { day: 'Mon', steps: 8500 },
  { day: 'Tue', steps: 12000 },
  { day: 'Wed', steps: 7800 },
  { day: 'Thu', steps: 10500 },
  { day: 'Fri', steps: 9200 },
  { day: 'Sat', steps: 11000 },
  { day: 'Sun', steps: 8432 },
];

const mockHeartRateData = [
  { day: 'Mon', rate: 68 },
  { day: 'Tue', rate: 72 },
  { day: 'Wed', rate: 70 },
  { day: 'Thu', rate: 75 },
  { day: 'Fri', rate: 73 },
  { day: 'Sat', rate: 69 },
  { day: 'Sun', rate: 72 },
];

const mockWeightData = [
  { week: 'Week 1', weight: 73.2 },
  { week: 'Week 2', weight: 72.8 },
  { week: 'Week 3', weight: 72.5 },
  { week: 'Week 4', weight: 72.5 },
];

const mockSleepData = [
  { day: 'Mon', hours: 7.5 },
  { day: 'Tue', hours: 8.2 },
  { day: 'Wed', hours: 6.8 },
  { day: 'Thu', hours: 7.8 },
  { day: 'Fri', hours: 7.2 },
  { day: 'Sat', hours: 8.5 },
  { day: 'Sun', hours: 7.5 },
];

interface HealthChartProps {
  type: 'steps' | 'heartRate' | 'weight' | 'sleep';
}

export const HealthChart = ({ type }: HealthChartProps) => {
  const getChartData = () => {
    switch (type) {
      case 'steps':
        return mockStepsData;
      case 'heartRate':
        return mockHeartRateData;
      case 'weight':
        return mockWeightData;
      case 'sleep':
        return mockSleepData;
      default:
        return [];
    }
  };

  const getDataKey = () => {
    switch (type) {
      case 'steps':
        return 'steps';
      case 'heartRate':
        return 'rate';
      case 'weight':
        return 'weight';
      case 'sleep':
        return 'hours';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'steps':
        return '#3b82f6';
      case 'heartRate':
        return '#ef4444';
      case 'weight':
        return '#8b5cf6';
      case 'sleep':
        return '#6366f1';
      default:
        return '#3b82f6';
    }
  };

  const data = getChartData();
  const dataKey = getDataKey();
  const color = getColor();

  if (type === 'steps' || type === 'sleep') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={type === 'weight' ? 'week' : 'day'} />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={3}
          dot={{ fill: color, strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: color, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
