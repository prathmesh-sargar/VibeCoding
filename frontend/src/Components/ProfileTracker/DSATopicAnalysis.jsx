import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DSATopicAnalysis = ({ topicData }) => {
    if (!topicData || Object.keys(topicData).length === 0) {
        return <p className="text-center text-gray-500">No topic analysis data available.</p>;
    }

    // Convert object into array and sort it in descending order of count
    const formattedData = Object.entries(topicData)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count); // Sort in descending order

    return (
        <div className="bg-white p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                DSA Topic Analysis
            </h2>
            <ResponsiveContainer width="100%" height={formattedData.length * 40 + 50}>
                <BarChart
                    layout="vertical"
                    data={formattedData}
                    margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                >
                    <XAxis type="number" />
                    <YAxis 
                        dataKey="topic" 
                        type="category" 
                        width={200} 
                        interval={0} // Ensures all labels are displayed
                    />
                    <Tooltip cursor={{ fill: "#f3f4f6" }} />
                    <Bar dataKey="count" fill="#3b82f6" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DSATopicAnalysis;
