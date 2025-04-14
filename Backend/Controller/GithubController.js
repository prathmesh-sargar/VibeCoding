import axios from "axios";
import { request, gql } from "graphql-request";
import dotenv from "dotenv";
import User from "../Model/User.js";
import GitHubData from "../Model/GitHubData.js";

dotenv.config();

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "User-Agent": "Node.js",
};

const getGitHubUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const refresh = req.query.refresh === "true";

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const username = user.platforms.github;
    if (!username) return res.status(400).json({ error: "GitHub username not linked" });

    // ⏱️ Check cached data
    const existingData = await GitHubData.findOne({ userId });

    const isDataValid =
      existingData &&
      !refresh &&
      new Date() - new Date(existingData.lastUpdated) < 6 * 60 * 60 * 1000; // 6 hours

    if (isDataValid) {
      console.log("✅ Returning cached GitHub data");
      return res.status(200).json(existingData.data);
    }

    console.log(`🔄 Refreshing GitHub data for ${username}...`);

    const userProfilePromise = axios.get(`${GITHUB_API_URL}/users/${username}`, { headers });
    const reposPromise = axios.get(`${GITHUB_API_URL}/users/${username}/repos?per_page=100`, { headers });
    const prPromise = axios.get(`${GITHUB_API_URL}/search/issues?q=author:${username}+is:pr`, { headers });
    const issuesPromise = axios.get(`${GITHUB_API_URL}/search/issues?q=author:${username}+is:issue`, { headers });
    const starsPromise = axios.get(`${GITHUB_API_URL}/users/${username}/starred`, { headers });

    const graphqlQuery = gql`
      query {
        user(login: "${username}") {
          contributionsCollection {
            totalCommitContributions
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
          repositories(first: 100, isFork: false) {
            nodes {
              name
              isFork
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const graphqlPromise = request(GITHUB_GRAPHQL_URL, graphqlQuery, {}, headers);

    const [repos, prData, issuesData, starsData, graphqlData] = await Promise.all([
      reposPromise,
      prPromise,
      issuesPromise,
      starsPromise,
      graphqlPromise,
    ]);

    // 🔍 Language usage stats
    const languages = {};
    let totalSize = 0;
    repos.data.forEach((repo) => {
      if (repo.language) {
        const size = repo.size;
        totalSize += size;
        languages[repo.language] = (languages[repo.language] || 0) + size;
      }
    });

    const languageStats = Object.entries(languages).map(([lang, size]) => ({
      language: lang,
      percentage: ((size / totalSize) * 100).toFixed(2),
    }));

    // 🔥 Heatmap
    const heatmap = graphqlData.user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (week) => week.contributionDays
    );

    // 📆 Active Days
    const activeDays = heatmap.filter((day) => day.contributionCount > 0).length;

    // ✅ Fixed: Use only totalCommitContributions (avoid double-counting)
    const totalCommits = graphqlData.user.contributionsCollection.totalCommitContributions;

    const githubData = {
      username,
      languages: languageStats,
      stats: {
        stars: starsData.data.length || 0,
        commits: totalCommits,
        pullRequests: prData.data.total_count || 0,
        issues: issuesData.data.total_count || 0,
      },
      totalContributions: totalCommits,
      activeDays,
      heatmap,
    };

    // 💾 Save to DB
    await GitHubData.findOneAndUpdate(
      { userId },
      { data: githubData, lastUpdated: new Date() },
      { upsert: true }
    );

    return res.status(200).json(githubData);
  } catch (error) {
    console.error("GitHub Data Fetch Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export { getGitHubUserData };
