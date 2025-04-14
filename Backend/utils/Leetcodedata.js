import axios from "axios";

// Base URL and Headers for LeetCode API
const LEETCODE_URL = "https://leetcode.com/graphql";
const HEADERS = {
  "Content-Type": "application/json",
  Referer: "https://leetcode.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

// Function to fetch submission stats
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

// Function to fetch topic-wise stats
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

  // Aggregate problems solved per topic
  const topicWiseDistribution = [...advanced, ...intermediate, ...fundamental].reduce((acc, topic) => {
    acc[topic.tagName] = (acc[topic.tagName] || 0) + topic.problemsSolved;
    return acc;
  }, {});

  return topicWiseDistribution;
};

// Function to fetch awards (badges)
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

// Controller to fetch LeetCode stats, topic analysis, and awards
const getLeetCodeStatsTopicsAwards = async (username) => {
  try {
    

    if (!username) return res.status(400).json({ error: "Username is required" });

    console.log(`🔹 Fetching LeetCode stats, topics, and awards for ${username}...`);

    const [stats, topicWiseDistribution, awards] = await Promise.all([
      fetchLeetCodeStats(username),
      fetchLeetCodeTopics(username),
      fetchLeetCodeAwards(username),
    ]);

    console.log(`✅ Successfully fetched LeetCode stats, topics, and awards for ${username}`);

    return {
      stats,
      topicAnalysisStats: { topicWiseDistribution },
      awards,
    };
  } catch (error) {
    console.error("❌ Error fetching LeetCode data:", error.message);
    return { error: "Internal Server Error" };
  }
};

export { getLeetCodeStatsTopicsAwards };