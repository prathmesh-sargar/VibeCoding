import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Card, CardContent } from "../ui/card";
import DSATopicAnalysis from "./DSATopicAnalysis";
import Stats from "./Stats";

const CodeforcesProfile = () => {
  const [data, setData] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/codeforces?refresh=true`);
        const result = res.data;
        setData(result);

        if (result?.submissionCalendar) {
          const heatmap = Object.entries(result.submissionCalendar).map(([timestamp, count]) => ({
            date: new Date(parseInt(timestamp) * 1000).toISOString().split("T")[0],
            count,
          }));
          setHeatmapData(heatmap);
        }

      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-center text-red-500">{error}</p>;

  const stats = data?.stats || [];
  const topicData = data?.topicAnalysisStats?.topicWiseDistribution || [];

  return (
    <div className="flex flex-col gap-4">
      {/* Stats + Heatmap */}
      <div className="lg:grid lg:grid-cols-5 gap-4 space-y-4 lg:space-y-0">
        {/* Basic Stats */}
        <div className="col-span-2 grid md:grid-cols-2 gap-4">
          <StatCard title="Total Questions" value={stats[0]?.count || 0} />
          <StatCard title="Total Active Days" value={heatmapData.length} />
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-3 p-4 bg-white border rounded-lg shadow-sm">
          <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
            <CalendarHeatmap
              startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
              endDate={new Date()}
              values={heatmapData}
              gutterSize={4}
              classForValue={(val) => {
                if (!val || val.count === 0) return "fill-gray-200";
                if (val.count === 1) return "fill-green-300";
                if (val.count === 2) return "fill-green-400";
                if (val.count === 3) return "fill-green-500";
                if (val.count === 4) return "fill-green-700";
                return "fill-green-900";
              }}
            />
          </div>
        </div>
      </div>

      {/* Ratings + Tag Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white border shadow-sm">
          <h2 className="text-lg font-semibold text-center text-gray-500">Contest Ratings</h2>
          <CardContent className="flex flex-col items-center gap-4 mt-4">
            <img
              src="https://codolio.com/landing/codeforces_user_icon.png"
              alt="Rating Badge"
              width={100}
              height={100}
              className="mx-auto"
              loading="lazy"
            />
            <div className="flex flex-col items-center">
              <h3 className="text-4xl font-bold">{data?.rating || 0}</h3>
              <div className="text-sm text-center text-gray-500">
                <p>({data?.maxRating || 0})</p>
                <p className="capitalize">{data?.rank || "Unrated"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Stats data={stats} />
      </div>

      {/* DSA Topic Analysis */}
      <DSATopicAnalysis topicData={topicData} />
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value }) => (
  <div className="p-4 bg-white border rounded-lg shadow-sm flex flex-col items-center">
    <span className="text-gray-500 font-medium">{title}</span>
    <span className="text-4xl font-bold">{value}</span>
  </div>
);

export default CodeforcesProfile;
