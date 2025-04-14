import { PieChart, Pie, Cell } from "recharts";
import { Card, CardContent } from "../ui/card";

const COLORS = {
  Easy: "#22c55e",
  Medium: "#facc15",
  Hard: "#ef4444",
};

export default function Stats({ data }) {
  if (!data || !Array.isArray(data)) return null; // Handle missing data safely

  // Transform API data to match PieChart format
  const filteredData = data
    .filter((entry) => entry.difficulty !== "All") // Exclude "All"
    .map((entry) => ({
      name: entry.difficulty,
      value: entry.count,
      color: COLORS[entry.difficulty] || "#ccc", // Default color if difficulty is unknown
    }));

  const totalSolved = filteredData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="w-full max-w-md p-6 shadow-md border rounded-lg bg-white">
      <CardContent className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-600">DSA Problems Solved</h3>
        
        {/* Pie Chart Section */}
        <div className="relative flex items-center justify-center my-4">
          <PieChart width={140} height={140}>
            <Pie
              data={filteredData}
              cx={70}
              cy={70}
              innerRadius={50}
              outerRadius={60}
              paddingAngle={3}
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <span className="absolute text-2xl font-bold text-black">{totalSolved}</span>
        </div>

        {/* Stats List */}
        <div className="w-full space-y-2">
          {filteredData.map((entry) => (
            <div key={entry.name} className="flex justify-between px-5 py-2 bg-gray-100 rounded-lg">
              <span className="font-semibold" style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-medium text-gray-800">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
