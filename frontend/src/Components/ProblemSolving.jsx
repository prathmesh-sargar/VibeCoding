import React, { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import DSAStats from "./ProfileTracker/DSAStats";
import DSATopicAnalysis from "./ProfileTracker/DSATopicAnalysis";

const ProblemSolving = () => {
    const [data, setData] = useState(null);
    const [heatmapData, setHeatmapData] = useState([]);
    const [totalContributions, setTotalContributions] = useState(0);
    const [streak, setStreak] = useState({ maxStreak: 0, currentStreak: 0 });
    const [showMore, setShowMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/leetcode/rohitsmali9421");
                if (!response.ok) throw new Error("Failed to fetch data");
                const result = await response.json();

                setData(result);

                // Process Heatmap Data
                if (result.submissionCalendar) {
                    const formattedData = Object.entries(result.submissionCalendar).map(([timestamp, count]) => ({
                        date: new Date(parseInt(timestamp) * 1000).toISOString().split("T")[0],
                        count,
                    }));
                    setHeatmapData(formattedData);
                    setTotalContributions(formattedData.reduce((sum, entry) => sum + entry.count, 0));
                }

                // Set Streak
                setStreak({
                    maxStreak: result.maxStreak || 0,
                    currentStreak: result.currentStreak || 0,
                });

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="flex flex-col gap-4">
            {/* Main Grid */}
            <div className="lg:grid w-full gap-4 lg:grid-cols-5 space-y-4 lg:space-y-0">
                {/* Stats Section */}
                <div className="col-span-2 grid md:grid-cols-2 gap-4">
                    {/* Total Questions */}
                    <StatCard title="Total Questions" value={data?.stats?.find(stat => stat.difficulty === "All")?.count || 0} />

                    {/* Total Active Days */}
                    <StatCard title="Total Active Days" value={heatmapData.length} />
                </div>

                {/* Heatmap & Streak Stats */}
                <div className="px-4 w-full bg-white h-full pt-4 border rounded-lg shadow-sm lg:col-span-3 md:px-4">
                    {/* Streak Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                        <p className="text-xs font-semibold text-black">
                            <span>{totalContributions} </span>
                            <span className="text-gray-500">Total Questions</span>
                        </p>
                        <div className="flex gap-4 text-xs font-semibold text-gray-500">
                            <div>Max Streak: <span className="text-black font-bold">{streak.maxStreak}</span></div>
                            <div>Current Streak: <span className="text-black font-bold">{streak.currentStreak}</span></div>
                        </div>
                    </div>

                    {/* Heatmap */}
                    <div className="mt-6 flex justify-center">
                        <div className="p-4 border rounded-lg shadow-sm bg-gray-50 w-full">
                            <CalendarHeatmap
                                startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
                                endDate={new Date()}
                                values={heatmapData}
                                classForValue={(value) => {
                                    if (!value || value.count === 0) return "fill-gray-200";
                                    if (value.count === 1) return "fill-green-300";
                                    if (value.count === 2) return "fill-green-400";
                                    if (value.count === 3) return "fill-green-500";
                                    if (value.count === 4) return "fill-green-700";
                                    return "fill-green-900";
                                }}
                                gutterSize={4}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Awards & DSA Stats */}
            <div className="flex flex-col gap-4 lg:flex-row">
                {/* Awards Section */}
                <AwardsSection badges={data?.awards} showMore={showMore} setShowMore={setShowMore} />

                {/* DSA Stats Section */}
                <DSAStats
                    easy={data?.stats?.find(stat => stat.difficulty === "Easy")?.count || 0}
                    medium={data?.stats?.find(stat => stat.difficulty === "Medium")?.count || 0}
                    hard={data?.stats?.find(stat => stat.difficulty === "Hard")?.count || 0}
                />
            </div>
            <div>
            <DSATopicAnalysis topicData={data?.topicAnalysisStats.topicWiseDistribution || []} />
            </div>
        </div>
    );
};

// Reusable StatCard Component
const StatCard = ({ title, value }) => (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2 p-4 bg-white border rounded-lg shadow-sm">
        <div className="font-semibold text-gray-500">{title}</div>
        <span className="text-5xl font-extrabold">{value}</span>
    </div>
);

// Awards Section Component
const AwardsSection = ({ badges, showMore, setShowMore }) => (
    <div className="flex-1 w-full p-4 bg-white border rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-500">Awards</h3>
            <span className="-mt-2 text-sm font-bold text-gray-400">{badges?.length || 0}</span>
        </div>

        {/* Badges */}
        <div className="flex justify-center w-full gap-4 mt-2 flex-wrap">
            {badges?.length > 0 ? (
                badges.map((badge, index) => (
                    <img
                        key={index}
                        src={badge.icon}
                        className="w-20 h-20"
                        alt={badge.name}
                        onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
                    />
                ))
            ) : (
                <p className="text-gray-500 text-center mt-2">No awards yet</p>
            )}
        </div>

        {/* Show More Button */}
        {badges?.length > 3 && (
            <div className="flex flex-col mt-2 text-sm text-center text-gray-500">
                {showMore && <span>Additional badges or details...</span>}
                <button className="flex items-center justify-center gap-1 text-blue-500 font-semibold hover:underline" onClick={() => setShowMore(!showMore)}>
                    {showMore ? "Show less" : "Show more"} {showMore ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>
        )}
    </div>
);

export default ProblemSolving;
