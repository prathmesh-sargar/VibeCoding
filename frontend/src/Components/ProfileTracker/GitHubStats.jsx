import { FaStar, FaCodeBranch, FaExclamationCircle } from "react-icons/fa";
import { FaCodeCommit } from "react-icons/fa6";

export default function GitHubStats({ data }) {
  // Destructuring data properly
  const { stars, commits, pullRequests, issues } = data || {};

  return (
    <div className="p-4 w-full bg-white border rounded-lg shadow-sm">
      <h2 className="text-gray-500 text-lg font-semibold">GitHub Stats</h2>
      <div className="flex flex-col gap-3 mt-3">
        <StatItem icon={<FaStar className="text-yellow-400 w-6 h-6" />} name="Stars" value={stars} />
        <StatItem icon={<FaCodeCommit className="text-orange-500 w-6 h-6" />} name="Commits" value={commits} />
        <StatItem icon={<FaCodeBranch className="text-green-400 w-6 h-6" />} name="PRs" value={pullRequests} />
        <StatItem icon={<FaExclamationCircle className="text-red-500 w-6 h-6" />} name="Issues" value={issues} />
      </div>
    </div>
  );
}

// Reusable StatItem Component
const StatItem = ({ icon, name, value }) => (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 flex justify-center items-center">{icon}</div>
      <h3 className="text-gray-600 font-medium">{name}</h3>
    </div>
    <p className="font-semibold text-black">{value ?? 0}</p> {/* Handle potential undefined values */}
  </div>
);
