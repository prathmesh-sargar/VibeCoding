import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setSingleInterview } from "../../Features/Auth/interviewSlice";

const AiInterview = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { interviewId } = useParams();
    const singleInterview = useSelector((state) => state.interview.singleInterview);

    useEffect(() => {
        const fetchInterviewData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/aiinterview/get/${interviewId}`
                );
                dispatch(setSingleInterview(response.data));
            } catch (error) {
                console.log(error);
            }
        };
        fetchInterviewData();
    }, [dispatch, interviewId]);

    // Optional: Reset API logic before retrying
    const handleRetryInterview = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/aiinterview/reset/${interviewId}`);
            navigate(`/AI-Interivew/${interviewId}/start`);
        } catch (error) {
            console.error("❌ Failed to reset interview:", error);
        }
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto mt-20  p-6 min-h-screen bg-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">
                    AI Interview Details
                </h1>
                <p className="text-lg text-gray-600">
                    Review your interview information before starting
                </p>
            </div>

            {/* Main Card */}
            <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {/* Card Header */}
                <div className="bg-blue-600 p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div className="mb-4 sm:mb-0">
                            <h2 className="text-2xl font-bold text-white">
                                {singleInterview?.jobRole || "Interview Position"}
                            </h2>
                            <p className="text-blue-100">
                                {singleInterview?.experienceLevel || "0"} years experience required
                            </p>
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-full">
                            <span className="text-white font-medium">
                                {singleInterview?.questions?.length || "0"} Questions
                            </span>
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {/* Scheduled Date */}
                            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Scheduled Date</h3>
                                </div>
                                <p className="text-gray-700 ml-11">
                                    {singleInterview?.createdAt ?
                                        new Date(singleInterview.createdAt).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : "Not specified"
                                    }
                                </p>
                            </div>

                            {/* Estimated Duration */}
                            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Estimated Duration</h3>
                                </div>
                                <p className="text-gray-700 ml-11">
                                    {singleInterview?.questions?.length ?
                                        `${Math.ceil(singleInterview.questions.length * 2.5)} minutes`
                                        : "Not specified"
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {/* Status */}
                            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Current Status</h3>
                                </div>
                                <div className="ml-11">
                                    {singleInterview?.finalScore ?
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            Completed ({singleInterview.finalScore}%)
                                        </span>
                                        :
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                            Not Started
                                        </span>
                                    }
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Difficulty</h3>
                                </div>
                                <div className="ml-11">
                                    {singleInterview?.experienceLevel >= 5 ?
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Advanced</span> :
                                        singleInterview?.experienceLevel >= 3 ?
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">Intermediate</span> :
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Beginner</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Job Description
                        </h3>
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                            <p className="text-gray-700 whitespace-pre-line">
                                {singleInterview?.jobDescription || "No job description provided."}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                        <motion.button
                            onClick={() => {
                                navigate(`/AI-Interivew/${interviewId}/start`);
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium text-lg flex items-center justify-center gap-2 shadow-md"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            {singleInterview?.finalScore ? "Retry Interview" : "Begin Interview"}
                        </motion.button>

                        <motion.button
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-lg font-medium text-lg flex items-center justify-center gap-2 shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Go Back
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AiInterview;
