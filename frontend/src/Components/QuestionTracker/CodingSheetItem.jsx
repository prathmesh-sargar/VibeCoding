import { FaCheckCircle, FaStar, FaTrash, FaStickyNote } from "react-icons/fa";


const CodingSheetItem = () => {
    return (
        <ul className="relative cursor-pointer bg-white dark:bg-darkBox-900 hover:bg-gray-100 dark:hover:bg-darkBox-800 flex flex-col items-center justify-between w-full gap-0.5 p-1 border rounded-md dark:border-darkBorder-800">
            <div className="flex flex-col w-full">
                <div className="flex flex-row w-full gap-1">
                    {/* Status Icon */}
                    <div className="w-[10%] sm:w-[4%] p-2 flex justify-center items-center">
                        <FaCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    
                    {/* Problem Title */}
                    <div className="w-[70%] sm:w-[40%] flex items-center">
                        <div className="w-full transition-all duration-300 text-xs md:text-[14px] font-[450] text-gray-800 dark:text-darkText-300">
                            Reverse Pairs
                        </div>
                    </div>
                    
                    {/* LeetCode Link */}
                    <div className="w-0 hidden sm:flex sm:w-[10%] justify-center items-center">
                        <a href="https://leetcode.com/problems/reverse-pairs" target="_blank" rel="noopener noreferrer">
                            <img alt="leetcode" width="24" className="w-6" src="/icons/leetcode_light.png" />
                        </a>
                    </div>
                    
                    {/* Difficulty Label */}
                    <div className="w-[25%] md:w-[10%] dark:text-white flex justify-center items-center">
                        <p className="min-w-[60px] rounded-md text-center text-xs font-semibold py-0.5 text-red-500">
                            Hard
                        </p>
                    </div>
                    
                    
                    
                    {/* Actions */}
                    <div className="w-0 sm:w-[20%] md:w-[14%] hidden sm:flex justify-center items-center gap-4">
                        <FaStar className="text-yellow-500 cursor-pointer" />
                        <button><FaStickyNote className="text-gray-500" /></button>
                        <button><FaTrash className="text-gray-500" /></button>
                    </div>
                </div>
                
                {/* Tags & Date */}
                <div className="items-center hidden w-full sm:flex">
                    <div className="w-[4%] h-2 rounded-md"></div>
                    <div className="flex justify-between w-full">
                        <div className="flex items-center overflow-y-scroll no-scrollbar">
                            <span title="Arrays" className="style-tag">Arrays</span>
                            <span title="Binary Search" className="style-tag">Binary Search</span>
                        </div>
                        <div className="flex w-[17.5%] justify-end items-center gap-2">
                            <p className="text-[11px] whitespace-nowrap text-gray-400">10th March, 2025</p>
                        </div>
                    </div>
                </div>
            </div>
        </ul>
    );
};

export default CodingSheetItem;
