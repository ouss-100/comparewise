import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PriceHistoryPoint } from "@/types/interf";

interface PriceChartProps {
  data: PriceHistoryPoint[];
}

const PriceChart = ({ data }: PriceChartProps) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(174 72% 56%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(174 72% 56%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(222 30% 18%)" 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            domain={['dataMin - 20', 'dataMax + 20']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(222 47% 9%)",
              border: "1px solid hsl(222 30% 18%)",
              borderRadius: "8px",
              padding: "12px",
            }}
            labelStyle={{ color: "hsl(215 20% 55%)" }}
            itemStyle={{ color: "hsl(174 72% 56%)" }}
            formatter={(value: number) => [`$${value}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(174 72% 56%)"
            strokeWidth={2}
            dot={{ fill: "hsl(174 72% 56%)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "hsl(174 72% 56%)", stroke: "hsl(222 47% 9%)", strokeWidth: 2 }}
            fill="url(#priceGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
