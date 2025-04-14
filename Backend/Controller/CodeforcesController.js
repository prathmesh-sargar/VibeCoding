import axios from "axios";
import CodeforcesData from "../Model/CodeforcesData.js";
import User from "../Model/User.js";

const CODEFORCES_URL = "https://codeforces.com/api";

// 📌 Fetch user rating, rank, and max values
const fetchCodeforcesUserInfo = async (username) => {
  const response = await axios.get(`${CODEFORCES_URL}/user.info?handles=${username}`);
  if (!response.data || response.data.status !== "OK") throw new Error("User not found");

  const user = response.data.result[0];
  return {
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank || "Unrated",
    maxRank: user.maxRank || "Unrated",
  };
};

// 📌 Problem-solving stats by difficulty
const fetchCodeforcesStats = async (username) => {
  const response = await axios.get(`${CODEFORCES_URL}/user.status?handle=${username}`);
  if (!response.data || response.data.status !== "OK") throw new Error("User not found");

  const solvedProblems = new Set();
  const difficultyStats = { Easy: 0, Medium: 0, Hard: 0 };

  response.data.result.forEach((submission) => {
    if (
      submission.verdict === "OK" &&
      submission.problem &&
      submission.problem.rating
    ) {
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
      { difficulty: "Hard", count: difficultyStats.Hard },
    ],
  };
};

// 📌 Submission heatmap data
const fetchCodeforcesSubmissions = async (username) => {
  const response = await axios.get(`${CODEFORCES_URL}/user.status?handle=${username}`);
  if (!response.data || response.data.status !== "OK") throw new Error("User not found");

  const submissionCalendar = {};
  response.data.result.forEach((submission) => {
    if (submission.verdict === "OK") {
      const timestamp = Math.floor(submission.creationTimeSeconds / 86400) * 86400;
      submissionCalendar[timestamp] = (submissionCalendar[timestamp] || 0) + 1;
    }
  });

  return submissionCalendar;
};

// 📌 Problems solved by tags/topics
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

// 🚀 Main controller with caching + manual refresh
const getAllCodeforcesData = async (req, res) => {
  try {
    const userId = req.user.id;
    const refresh = req.query.refresh === "true";

    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const user = await User.findById(userId);
    if (!user || !user.platforms || !user.platforms.codeforces) {
      return res.status(404).json({ error: "Codeforces username not found for this user" });
    }

    const username = user.platforms.codeforces;

    const cached = await CodeforcesData.findOne({ userId });
    const isCacheValid = cached && !refresh && new Date() - cached.lastUpdated < 6 * 60 * 60 * 1000;

    if (isCacheValid) {
      console.log("✅ Serving Codeforces data from cache");
      return res.status(200).json(cached.data);
    }

    console.log(`🔄 Fetching fresh Codeforces data for ${username}`);

    const [userInfo, stats, submissionCalendar, topicAnalysisStats] = await Promise.all([
      fetchCodeforcesUserInfo(username),
      fetchCodeforcesStats(username),
      fetchCodeforcesSubmissions(username),
      fetchCodeforcesProblemTags(username),
    ]);

    const finalData = {
      username,
      rating: userInfo.rating,
      maxRating: userInfo.maxRating,
      rank: userInfo.rank,
      maxRank: userInfo.maxRank,
      stats: stats.stats,
      submissionCalendar,
      topicAnalysisStats,
    };

    await CodeforcesData.findOneAndUpdate(
      { userId },
      { data: finalData, lastUpdated: new Date() },
      { upsert: true }
    );

    return res.status(200).json(finalData);
  } catch (error) {
    console.error("❌ Codeforces Fetch Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export { getAllCodeforcesData };
