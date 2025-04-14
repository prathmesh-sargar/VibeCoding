import React, { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const BASE_API_URL = "http://localhost:4000/api/github/";

function DevStats({ username = "Rohitmali9421" }) {
    const [userData, setUserData] = useState(null);
    const [heatmapData, setHeatmapData] = useState([]);
    const [streak, setStreak] = useState({ maxStreak: 0, currentStreak: 0 });

    useEffect(() => {
        async function fetchGitHubData() {
            try {
                const response = await fetch(`${BASE_API_URL}${username}`);
                if (!response.ok) throw new Error("Failed to fetch data");
                
                const data = await response.json();
                setUserData(data);

                const formattedData = data.heatmap.map(entry => ({
                    date: entry.date,
                    count: entry.contributionCount,
                }));
                setHeatmapData(formattedData);
                calculateStreak(formattedData);
            } catch (error) {
                console.error("Failed to fetch GitHub data:", error);
            }
        }

        fetchGitHubData();
    }, [username]);

    function calculateStreak(contributions) {
        let maxStreak = 0, currentStreak = 0, streakCounter = 0;
        let previousDate = null;

        for (let i = contributions.length - 1; i >= 0; i--) {
            if (contributions[i].count > 0) {
                streakCounter++;
                maxStreak = Math.max(maxStreak, streakCounter);
                
                const currentDate = new Date(contributions[i].date);
                if (!previousDate || (currentDate - new Date(previousDate) === 86400000)) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
                previousDate = contributions[i].date;
            } else {
                streakCounter = 0;
            }
        }

        setStreak({ maxStreak, currentStreak });
    }

    return (
        <div className="flex flex-col gap-4">
            {userData && (
                <div className="flex items-center space-x-4">
                    <img src={userData.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
                    <div>
                        <a href={userData.profileUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-500">
                            {userData.username}
                        </a>
                        <p className="text-sm text-gray-600">Repositories: {userData.totalRepos} | Followers: {userData.followers} | Following: {userData.following}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border rounded-lg shadow-sm text-center">
                    <h2 className="text-gray-500 font-semibold">Total Contributions</h2>
                    <span className="text-5xl font-extrabold">{userData?.totalContributions}</span>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm text-center">
                    <h2 className="text-gray-500 font-semibold">Stars</h2>
                    <span className="text-5xl font-extrabold">{userData?.stars}</span>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm text-center">
                    <h2 className="text-gray-500 font-semibold">Commits</h2>
                    <span className="text-5xl font-extrabold">{userData?.commits}</span>
                </div>
                <div className="p-4 bg-white border rounded-lg shadow-sm text-center">
                    <h2 className="text-gray-500 font-semibold">Pull Requests</h2>
                    <span className="text-5xl font-extrabold">{userData?.pullRequests}</span>
                </div>
            </div>

            {/* Contribution Heatmap */}
            <div className="p-4 bg-white border rounded-lg shadow-sm">
                <h2 className="text-gray-500 font-semibold text-center mb-4">Contribution Heatmap</h2>
                <CalendarHeatmap
                    startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
                    endDate={new Date()}
                    values={heatmapData}
                    classForValue={(value) => {
                        if (!value || value.count === 0) return "fill-gray-200";
                        if (value.count === 1) return "fill-green-300";
                        if (value.count === 2) return "fill-green-400";
                        if (value.count === 3) return "fill-green-500";
                        return "fill-green-700";
                    }}
                    gutterSize={4}
                />
            </div>

            {/* Language Proficiency Chart */}
            {userData && (
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <h2 className="text-gray-500 font-semibold text-center mb-4">Language Proficiency</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {userData.languages.map((lang, index) => (
                            <div key={index} className="flex justify-between border p-2 rounded-md">
                                <span className="font-semibold">{lang.language}</span>
                                <span className="text-gray-600">{(lang.percentage * 100).toFixed(2)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DevStats;
