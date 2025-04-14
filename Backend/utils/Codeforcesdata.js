import axios from "axios";

const CODEFORCES_URL = "https://codeforces.com/api";

// Fetch basic user info including rating and rank
const fetchCodeforcesUserInfo = async (username) => {
    const response = await axios.get(`${CODEFORCES_URL}/user.info?handles=${username}`);
    if (!response.data || response.data.status !== "OK") throw new Error("User not found");

    const user = response.data.result[0];
    return {
        rating: user.rating || 0, // Current rating
        maxRating: user.maxRating || 0, // Highest rating achieved
        rank: user.rank || "Unrated",
        maxRank: user.maxRank || "Unrated"
    };
};

// Fetch problem-solving stats categorized by difficulty
const fetchCodeforcesStats = async (username) => {
    const response = await axios.get(`${CODEFORCES_URL}/user.status?handle=${username}`);
    if (!response.data || response.data.status !== "OK") throw new Error("User not found");

    const solvedProblems = new Set();
    const difficultyStats = { Easy: 0, Medium: 0, Hard: 0 };

    response.data.result.forEach((submission) => {
        if (submission.verdict === "OK" && submission.problem && submission.problem.rating) {
            const problemId = submission.problem.contestId + "-" + submission.problem.index;
            if (!solvedProblems.has(problemId)) {
                solvedProblems.add(problemId);

                if (submission.problem.rating <= 1200) difficultyStats.Easy++;
                else if (submission.problem.rating <= 2000) difficultyStats.Medium++;
                else difficultyStats.Hard++;
            }
        }
    });

    return {
        username,
        stats: [
            { difficulty: "All", count: solvedProblems.size },
            { difficulty: "Easy", count: difficultyStats.Easy },
            { difficulty: "Medium", count: difficultyStats.Medium },
            { difficulty: "Hard", count: difficultyStats.Hard }
        ]
    };
};

// Fetch problems solved by topic/tags
const fetchCodeforcesProblemTags = async (username) => {
    const response = await axios.get(`${CODEFORCES_URL}/user.status?handle=${username}`);
    if (!response.data || response.data.status !== "OK") throw new Error("User not found");

    const topicWiseDistribution = {};
    response.data.result.forEach((submission) => {
        if (submission.verdict === "OK" && submission.problem.tags) {
            submission.problem.tags.forEach((tag) => {
                topicWiseDistribution[tag] = (topicWiseDistribution[tag] || 0) + 1;
            });
        }
    });
    return { topicWiseDistribution };
};

// Main API function to fetch Codeforces data needed for the specified structure
const getCodeforcesDataForStructure = async (username) => {
    try {
        if (!username) return res.status(400).json({ error: "Username is required" });

        console.log(`🔹 Fetching Codeforces data for ${username}...`);

        // Fetch user rating, stats, and topic analysis
        const [userInfo, stats, topicAnalysisStats] = await Promise.all([
            fetchCodeforcesUserInfo(username),
            fetchCodeforcesStats(username),
            fetchCodeforcesProblemTags(username)
        ]);

        console.log(`✅ Successfully fetched Codeforces data for ${username}`);

        return {
            rating: userInfo.rating,
            maxRating: userInfo.maxRating,
            rank: userInfo.rank,
            maxRank: userInfo.maxRank,
            stats: stats.stats,
            topicAnalysisStats,
        };
    } catch (error) {
        console.error("❌ Error fetching Codeforces data:", error.message);
        return { error: "Internal Server Error" };
    }
};

export { getCodeforcesDataForStructure };