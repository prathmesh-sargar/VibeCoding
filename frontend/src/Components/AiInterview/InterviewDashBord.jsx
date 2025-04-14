import { setUserInterviews } from "../../Features/Auth/interviewSlice";

import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // 🔥
import { FiTrash2 } from "react-icons/fi"; // 🔥
import { Button } from "../ui/button"; // 🔥

export default function InterviewDashBord() {
    const dispatch = useDispatch();
    const userInterviewList = useSelector((state) => state.interview.userInterviews);

    useEffect(() => {
        const fetchAllInterview = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/aiinterview/getUserInterviews`);
                dispatch(setUserInterviews(response.data));
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllInterview();
    }, [dispatch]);

    // 🔥 Delete Interview Function
    const handleDeleteInterview = async (interviewId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/aiinterview/interview/${interviewId}`);
            dispatch(setUserInterviews(userInterviewList.filter(i => i._id !== interviewId)));
            toast.success("Interview deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete interview.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <motion.h1
                className="text-3xl font-bold text-center text-gray-800 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                📋 Interview Dashboard
            </motion.h1>

            <div className="flex justify-center mb-8">
                <Link to="/AIJobForm">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        Start New Interview
                    </motion.button>
                </Link>
            </div>

            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">📝 Interview List</h2>

                {userInterviewList.length === 0 ? (
                    <p className="text-center text-gray-500">No interviews found. Start your first interview now!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userInterviewList.map((interview) => (
                            <motion.div
                                key={interview._id}
                                whileHover={{ scale: 1.03 }}
                                className="relative bg-white p-5 rounded-xl shadow-md border border-gray-300 flex flex-col items-center"
                            >
                                {/* 🔥 Delete Icon Button */}
                                <Button
                                    variant="ghost"
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteInterview(interview._id)}
                                >
                                    <FiTrash2 size={20} />
                                </Button>

                                <h3 className="text-lg font-semibold text-gray-800">{interview?.jobRole}</h3>
                                <p className="text-sm text-gray-600">📅 Date: {interview?.updatedAt.toString().split("T")[0]}</p>
                                <div className="mt-4 flex gap-3">
                                    <Link to={`/AI-Interivew/${interview?._id}`}>
                                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow">
                                            Start
                                        </button>
                                    </Link>

                                    <Link to={`/AI-Interivew/${interview?._id}/score`}>
                                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow">
                                            Feedback
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}