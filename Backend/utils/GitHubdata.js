import axios from "axios";
import { request, gql } from "graphql-request";
import dotenv from "dotenv";

dotenv.config();

// GitHub API URLs
const GITHUB_API_URL = "https://api.github.com";
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

// GitHub Token (Set in .env file)
const TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "User-Agent": "Node.js",
};

const getGitHubLanguagesAndStats = async (username) => {
  try {

    // Fetch user repositories
    const reposPromise = axios.get(`${GITHUB_API_URL}/users/${username}/repos?per_page=100`, { headers });

    // Fetch pull requests
    const prPromise = axios.get(`${GITHUB_API_URL}/search/issues?q=author:${username}+is:pr`, { headers });

    // Fetch issues
    const issuesPromise = axios.get(`${GITHUB_API_URL}/search/issues?q=author:${username}+is:issue`, { headers });

    // Fetch starred repositories
    const starsPromise = axios.get(`${GITHUB_API_URL}/users/${username}/starred`, { headers });

    // Fetch contribution heatmap and commits using GraphQL
    const graphqlQuery = gql`
      query {
        user(login: "${username}") {
          contributionsCollection {
            totalCommitContributions
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

    // Await all promises in parallel
    const [repos, prData, issuesData, starsData, graphqlData] = await Promise.all([
      reposPromise,
      prPromise,
      issuesPromise,
      starsPromise,
      graphqlPromise,
    ]);

    // Process language usage from repositories
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

    // 🔥 **Fixed Commit Calculation**
    let totalCommits = graphqlData.user.contributionsCollection.totalCommitContributions;

    // Add commit counts from repositories (excluding forks)
    graphqlData.user.repositories.nodes.forEach((repo) => {
      if (!repo.isFork && repo.defaultBranchRef?.target?.history?.totalCount) {
        totalCommits += repo.defaultBranchRef.target.history.totalCount;
      }
    });

    // Construct final response
    return {
      languages: languageStats,
      stats: {
        stars: starsData.data.length || 0,
        commits: totalCommits, // ✅ Corrected Commit Count
        pullRequests: prData.data.total_count || 0,
        issues: issuesData.data.total_count || 0,
      },
    }
  } catch (error) {
    return {error:"data not found"}
  }
};

export { getGitHubLanguagesAndStats };