// controllers/leetcodeController.js

import axios from "axios";
import User from "../Model/User.js";
import LeetCodeData from "../Model/LeetCodeData.js";

const LEETCODE_URL = "https://leetcode.com/graphql";
const HEADERS = {
  "Content-Type": "application/json",
  Referer: "https://leetcode.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

// Fetch from LeetCode APIs
const fetchLeetCodeStats = async (username) => {
  const data = {
    query: `query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }`,
    variables: { username },
  };
  const response = await axios.post(LEETCODE_URL, data, { headers: HEADERS });
  if (!response.data?.data?.matchedUser) throw new Error("User not found");
  return response.data.data.matchedUser.submitStatsGlobal.acSubmissionNum;
};

const fetchSubmissionCalendar = async (username) => {
  const data = {
    query: `query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submissionCalendar
      }
    }`,
    variables: { username },
  };
  const response = await axios.post(LEETCODE_URL, data, { headers: HEADERS });
  if (!response.data?.data?.matchedUser) throw new Error("User not found");
  return JSON.parse(response.data.data.matchedUser.submissionCalendar);
};

const fetchLeetCodeTopics = async (username) => {
  const data = {
    query: `query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        tagProblemCounts {
          advanced { tagName problemsSolved }
          intermediate { tagName problemsSolved }
          fundamental { tagName problemsSolved }
        }
      }
    }`,
    variables: { username },
  };
  const response = await axios.post(LEETCODE_URL, data, { headers: HEADERS });
  if (!response.data?.data?.matchedUser) throw new Error("User not found");

  const { advanced, intermediate, fundamental } =
    response.data.data.matchedUser.tagProblemCounts;

  const topicWiseDistribution = [
    ...advanced,
    ...intermediate,
    ...fundamental,
  ].reduce((acc, topic) => {
    acc[topic.tagName] = (acc[topic.tagName] || 0) + topic.problemsSolved;
    return acc;
  }, {});

  return topicWiseDistribution;
};

const fetchLeetCodeAwards = async (username) => {
  const data = {
    query: `query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        badges {
          id
          displayName
          icon
        }
      }
    }`,
    variables: { username },
  };
  const response = await axios.post(LEETCODE_URL, data, { headers: HEADERS });
  if (!response.data?.data?.matchedUser) throw new Error("User not found");

  return response.data.data.matchedUser.badges.map((badge) => ({
    id: badge.id,
    name: badge.displayName,
    icon: badge.icon,
  }));
};

// Controller
const getAllLeetCodeData = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) return res.status(400).json({ error: "User ID is required" });

    // 🔍 Fetch user from DB and extract Codeforces handle
    const user = await User.findById(userId);
    if (!user || !user.platforms || !user.platforms.leetcode) {
      return res
        .status(404)
        .json({ error: "Leetcode username not found for this user" });
    }

    const username = user.platforms.leetcode;
    const refresh = req.query.refresh === "true";

    if (!username)
      return res.status(400).json({ error: "Username is required" });

    let profile = await LeetCodeData.findOne({ username });

    const oneDayOld =
      profile && new Date() - profile.lastUpdated > 24 * 60 * 60 * 1000;

    if (!profile || refresh || oneDayOld) {
      console.log(`🔁 Fetching fresh LeetCode data for ${username}...`);
      const [stats, submissionCalendar, topicWiseDistribution, awards] =
        await Promise.all([
          fetchLeetCodeStats(username),
          fetchSubmissionCalendar(username),
          fetchLeetCodeTopics(username),
          fetchLeetCodeAwards(username),
        ]);

      const newData = {
        userId, // ✅ FIX: add userId as required in schema
        username,
        stats,
        submissionCalendar,
        topicAnalysisStats: { topicWiseDistribution },
        awards,
        lastUpdated: new Date(),
      };

      if (!profile) {
        profile = new LeetCodeData(newData);
      } else {
        Object.assign(profile, newData);
      }

      await profile.save();
    } else {
      console.log(`📦 Returning cached LeetCode data for ${username}`);
    }

    return res.status(200).json({
      username: profile.username,
      stats: profile.stats,
      submissionCalendar: profile.submissionCalendar,
      topicAnalysisStats: profile.topicAnalysisStats,
      awards: profile.awards,
      lastUpdated: profile.lastUpdated,
    });
  } catch (error) {
    console.error("❌ Error fetching LeetCode data:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export { getAllLeetCodeData };
