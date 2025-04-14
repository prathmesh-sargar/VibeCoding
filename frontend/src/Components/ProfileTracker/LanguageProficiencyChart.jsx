
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Color mapping for different languages
const colorMap = {
  JavaScript: "#FACC15", // Yellow
  Java: "#60A5FA", // Blue
  Python: "#34D399", // Green
  CSS: "#10B981", // Green (Different Shade)
  HTML: "#EF4444", // Red
};

export default function LanguageProficiencyChart({data} ) {

  // Convert API response to the required format
  const formattedData = data
    .map((item) => ({
      language: item.language,
      value: parseFloat(item.percentage), // Convert percentage string to number
      color: colorMap[item.language] || "#8884d8", // Default color if not found
    }))
    .filter((item) => item.value > 0); // Remove languages with 0%

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={50}>
          <BarChart
            layout="vertical"
            data={[{ name: "Languages", ...formattedData.reduce((acc, cur) => ({ ...acc, [cur.language]: cur.value }), {}) }]}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip />
            {formattedData.map((entry, index) => (
              <Bar key={index} dataKey={entry.language} stackId="1" barSize={20}>
                <Cell fill={entry.color} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {formattedData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-sm font-medium">{item.language}</span>
              <span className="text-sm text-gray-500">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
