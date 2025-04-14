import { useState } from "react";

const platforms = [
  "LeetCode",
  "CodeChef",
  "CodeForces",
  "AtCoder",
  "GeeksForGeeks",
];

const SearchFilter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const togglePlatformSelection = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((item) => item !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="flex flex-col justify-end w-full gap-2 mb-2 lg:gap-4 sm:flex-row md:flex-col lg:flex-row">
      {/* Search Bar */}
      <form className="flex items-center flex-1 bg-white dark:bg-darkBox-900 dark:border-darkBorder-800 border rounded p-0.5">
        <label htmlFor="query" className="sr-only">Search</label>
        <div className="relative w-full">
          <input
            type="text"
            id="query"
            className="w-full p-1.5 pr-10 text-gray-800 bg-transparent dark:border-darkBorder-700 placeholder:text-gray-500 dark:text-white focus:outline-none"
            placeholder="Search Contests"
            name="query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="button" className="h-full p-3 text-sm font-medium text-gray-600 rounded ms-2 focus:ring-0 focus:outline-none">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg">
            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
          </svg>
        </button>
      </form>

      {/* Filter Dropdown */}
      <div className="relative flex-1 lg:w-[50%] md:w-full sm:w-[50%] w-full p-2 border rounded bg-white dark:bg-darkBox-900 dark:border-darkBorder-800">
        <div className="flex justify-between w-full mt-0.5 ">
          <div className="justify-start w-[95%]">
            <button
              className="w-full text-sm text-zinc-500 text-start"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedPlatforms.length > 0 ? selectedPlatforms.join(", ") : "Select Platforms"}
            </button>
          </div>
          <span
            className="w-[5%] cursor-pointer text-btnBlue p-1 dark:text-darkText-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </span>
        </div>

        {isDropdownOpen && (
          <div className="absolute mt-2 w-full bg-white dark:bg-darkBox-900 border border-gray-300 dark:border-darkBorder-800 rounded-md shadow-lg p-2">
            {platforms.map((platform, index) => (
              <button
                key={index}
                className={`flex w-full border gap-1 transition duration-200 font-[450] py-1 px-4 rounded-md ${selectedPlatforms.includes(platform) ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-600 dark:bg-darkBox-900 dark:text-darkText-300 dark:border-darkBorder-800"}`}
                onClick={() => togglePlatformSelection(platform)}
              >
                <span className="text-xs">{platform}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
