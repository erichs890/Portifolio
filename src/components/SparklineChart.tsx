"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function SparklineChart({
  data,
  color = "#3B82F6",
  height = 32,
}: SparklineChartProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          strokeOpacity={0.7}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
