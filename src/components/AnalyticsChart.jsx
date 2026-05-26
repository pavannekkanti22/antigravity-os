import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const defaultData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 5200 },
  { month: "Mar", revenue: 6100 },
  { month: "Apr", revenue: 7200 },
  { month: "May", revenue: 8400 },
  { month: "Jun", revenue: 9300 },
];

function AnalyticsChart({ data = defaultData }) {
  return (
    <div className="h-[300px]">

      <ResponsiveContainer width="100%" height="100%">

        <AreaChart data={data}>

          <defs>

            <linearGradient
              id="colorRevenue"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#8B5CF6"
                stopOpacity={0.8}
              />

              <stop
                offset="95%"
                stopColor="#8B5CF6"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <XAxis
            dataKey="month"
            stroke="#71717A"
          />

          <Tooltip
            contentStyle={{
              background: "#18181B",
              border: "1px solid #27272A",
              borderRadius: "16px",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8B5CF6"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={3}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}

export default AnalyticsChart;