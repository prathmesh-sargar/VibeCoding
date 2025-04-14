import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import LanguageProficiencyChart from "./LanguageProficiencyChart";
import GitHubStats from "./GitHubStats";



function DevStats() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [totalContributions, setTotalContributions] = useState(0);
    const [activedays, setactivedays] = useState(0);
    const [languages, setLanguages] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchGitHubData = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/github?refresh=true`);

                console.log("GitHub API Response:", data);

                setTotalContributions(data.totalContributions);
                setLanguages(data.languages || []);
                setStats(data.stats);
                setactivedays(data.activeDays)
                // Format heatmap data
                const formattedData = data.heatmap?.map(entry => ({
                    date: entry.date,
                    count: entry.contributionCount,
                })) || [];
                setHeatmapData(formattedData);
            } catch (error) {
                console.error("Failed to fetch GitHub data:", error);
            } finally {
                setLoading(false); // Stop loading once API call is completed
            }
        };

        fetchGitHubData();
    }, []);

    if (loading) {
        return <div className="text-center p-6 text-xl font-semibold">Loading GitHub Stats...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="lg:grid w-full gap-4 lg:space-y-0 space-y-4 lg:grid-cols-5">
                <div className="col-span-2 grid md:grid-cols-2 gap-4">
                    {/* Total Contributions */}
                    <StatCard title="Total Contributions" value={totalContributions} />
                    {/* Total Active Days */}
                    <StatCard title="Total Active Days" value={activedays} />
                </div>

                {/* Contribution Heatmap */}
                <div className="p-4 w-full bg-white h-full pt-4 relative border rounded-lg shadow-sm lg:col-span-3">
                    <div className="flex justify-center">
                        <div className="p-4 border rounded-lg shadow-sm bg-gray-50 w-full overflow-hidden">
                            <CalendarHeatmap
                                startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
                                endDate={new Date()}
                                values={heatmapData}
                                classForValue={(value) => {
                                    if (!value || value.count === 0) return "fill-gray-200"; // No contribution (gray)
                                    if (value.count === 1) return "fill-green-300";
                                    if (value.count === 2) return "fill-green-400";
                                    if (value.count === 3) return "fill-green-500";
                                    if (value.count === 4) return "fill-green-700";
                                    return "fill-green-900"; // 5+ contributions
                                }}
                                gutterSize={4}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Language Proficiency Chart */}
                {languages.length > 0 && <LanguageProficiencyChart data={languages} />}

                {/* GitHub Stats - Pass data */}
                <GitHubStats
                    data={stats}
                />
            </div>
        </div>
    );
}

// Reusable StatCard Component
const StatCard = ({ title, value }) => (
    <div className="relative flex flex-col items-center justify-center w-full h-full gap-2 p-4 bg-white border rounded-lg shadow-sm">
        <div className="font-semibold text-gray-500">{title}</div>
        <span className="text-5xl font-extrabold">{value}</span>
    </div>
);

export default DevStats;
