import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { PiBookmarkFill } from "react-icons/pi";
import { Button } from "../ui/button"; // ShadCN Button
import DropdownTable from "./DropdownTable";
import axios from "axios";
import { PieChart, Pie, Cell } from "recharts";
import { useSelector } from "react-redux";

const COLORS = ["#16a34a", "#e5e7eb"]; // Green (Completed), Gray (Remaining)

const SheetDetails = () => {
    const { id: sheetId } = useParams(); // Get sheetId from URL
    const [isFollowing, setIsFollowing] = useState(false);
    const [sheetQuestions, setSheetQuestions] = useState([]);
    const [completed, setCompleted] = useState(19);
    const [total, setTotal] = useState(null);
    const [title, settitle] = useState(null);
    const [description, setdescription] = useState(null);
    const { user } = useSelector((state) => state.auth);


    // Fetch Sheet Questions
    const fetchSheetQuestions = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/sheets/details`, {
                sheetId: sheetId,
            });
            setTotal(response.data.totalquestion)
            setCompleted(response.data.totalsolved)
            setdescription(response.data.description)
            settitle(response.data.title)
            setSheetQuestions(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (sheetId) {
            fetchSheetQuestions();
        }
    }, [sheetId]); // Fetch when sheetId changes

    // Follow/Unfollow Function
    const handleFollow = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/sheets/follow`, {
                sheetId,
            });
            setIsFollowing(!isFollowing); // Toggle state
        } catch (error) {
            console.error("Error following sheet:", error);
        }
    };

    const data = [
        { name: "Completed", value: completed },
        { name: "Remaining", value: total - completed },
    ];

    return (
        <div>
            {/* Header Section */}
            <header className="w-full flex flex-col md:flex-row justify-between px-4 py-4 bg-white border md:rounded-t-md shadow-sm">
                {/* Left Section */}
                <div className="w-full md:w-3/4 flex flex-col gap-2">
                    <h2 className="text-2xl md:text-4xl font-semibold text-gray-800">{title}</h2>
                    <p className="text-gray-500 text-sm">
                        {description}
                    </p>

                    {/* Follow Button */}
                    <Button
                        variant="outline"
                        className={`flex items-center gap-2 text-sm font-medium mt-2 ${isFollowing ? "border-green-500 text-green-600" : ""}`}
                        onClick={handleFollow}
                    >
                        <PiBookmarkFill className="text-codolioBase" size={18} />
                        {isFollowing ? "Following" : "Follow"}
                    </Button>
                </div>

                {/* Right Section - Pie Chart */}
                <div className="w-full md:w-1/4 flex justify-center md:justify-end">
                    <div className="relative w-[120px] md:w-[160px] flex flex-col items-center">
                        <PieChart width={120} height={120}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={50}
                                fill="#8884d8"
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>

                        {/* Progress Count */}
                        <div className="absolute top-[40%] transform -translate-y-1/2 w-fit text-lg font-bold text-gray-800">
                            <div className="flex flex-col text-center">
                                <span className="text-2xl">{completed}</span>
                                <hr className="w-10 border-black mx-auto" />
                                <span className="text-xl text-gray-500">{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Questions List */}
            <div className="p-4">
                <DropdownTable topics={sheetQuestions} sheetId={sheetId} />
            </div>
        </div>
    );
};

export default SheetDetails;
