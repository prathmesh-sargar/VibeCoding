import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { setSingleInterview } from "../../Features/Auth/interviewSlice";
import { FiChevronDown, FiChevronUp, FiArrowLeft, FiRefreshCw } from "react-icons/fi";

const ScorePage = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const InterviewData = useSelector((state) => state.interview.singleInterview);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchInterviewData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/aiinterview/get/${interviewId}`
                );
                dispatch(setSingleInterview(response.data));
            } catch (error) {
                console.error("Error fetching interview:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInterviewData();
    }, [dispatch, interviewId]);

    // Data for radial charts
    const createChartData = (value, color, name) => [
        { value: value || 0, fill: color, name }
    ];

    const getPerformanceText = (score, goodText, mediumText, poorText) => {
        return score >= 70 ? goodText : score >= 40 ? mediumText : poorText;
    };

    return (
        <div className="min-h-screen mt-16 bg-gradient-to-br from-indigo-50 to-blue-100">
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            ) : (
                <motion.div
                    className="max-w-6xl mx-auto py-8 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <motion.button
                            whileHover={{ x: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/ainterview")}
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                            <FiArrowLeft className="text-blue-600" />
                            <span className="text-blue-600 font-medium">Dashboard</span>
                        </motion.button>
                        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Interview Insights
                        </h1>
                        <div className="w-10"></div> {/* Spacer for alignment */}
                    </div>

                    {/* Score Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {/* Confidence Card */}
                        <motion.div
                            className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-blue-500"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                Confidence Score
                            </h2>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart
                                        innerRadius="40%"
                                        outerRadius="90%"
                                        data={createChartData(InterviewData?.confidence, "#3b82f6", "Confidence")}
                                        startAngle={180}
                                        endAngle={0}
                                    >
                                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                        <RadialBar
                                            background
                                            dataKey="value"
                                            cornerRadius={10}
                                            animationDuration={1500}
                                        />
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="text-3xl font-bold fill-gray-800"
                                        >
                                            {InterviewData?.confidence || 0}%
                                        </text>
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-center text-gray-600 italic">
                                {getPerformanceText(
                                    InterviewData?.confidence,
                                    "Excellent confidence level!",
                                    "Good, but room for improvement",
                                    "Practice will help build confidence"
                                )}
                            </p>
                        </motion.div>

                        {/* Eye Contact Card */}
                        <motion.div
                            className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-green-500"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                Eye Contact Score
                            </h2>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart
                                        innerRadius="40%"
                                        outerRadius="90%"
                                        data={createChartData(InterviewData?.eyecontact, "#10b981", "Eye Contact")}
                                        startAngle={180}
                                        endAngle={0}
                                    >
                                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                        <RadialBar
                                            background
                                            dataKey="value"
                                            cornerRadius={10}
                                            animationDuration={1500}
                                        />
                                        <text
                                            x="50%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="text-3xl font-bold fill-gray-800"
                                        >
                                            {InterviewData?.eyecontact || 0}%
                                        </text>
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-center text-gray-600 italic">
                                {getPerformanceText(
                                    InterviewData?.eyecontact,
                                    "Exceptional eye contact!",
                                    "Good, but could be more consistent",
                                    "Try to maintain more eye contact"
                                )}
                            </p>
                        </motion.div>
                    </div>

                    {/* Questions Section */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">Question Analysis</h2>
                            <p className="text-gray-600">Detailed feedback on each interview question</p>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {InterviewData?.questions?.map((question, index) => (
                                <motion.div
                                    key={question._id}
                                    className="p-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-blue-600 font-medium">{index + 1}</span>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {question.questionText}
                                            </h3>
                                        </div>
                                        <div className="text-gray-400">
                                            {expandedQuestion === index ? <FiChevronUp /> : <FiChevronDown />}
                                        </div>
                                    </div>

                                    {expandedQuestion === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-4 space-y-4 pl-12"
                                        >
                                            <div>
                                                <h4 className="text-sm font-semibold text-blue-600 mb-1">YOUR ANSWER</h4>
                                                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                                                    {question.userAnswer || "No answer provided"}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-green-600 mb-1">MODEL ANSWER</h4>
                                                <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
                                                    {question.aiAnswer || "No model answer available"}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-amber-600 mb-1">FEEDBACK</h4>
                                                <p className="text-gray-700 bg-amber-50 p-3 rounded-lg">
                                                    {question.aiFeedback || "No feedback available"}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-purple-600 mb-1">SCORE</h4>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                                style={{ width: `${question.score * 10}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="font-bold text-gray-800">{question.score}/10</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mt-10">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition-all flex items-center gap-2"
                            onClick={() => navigate("/ainterview")}
                        >
                            <FiArrowLeft />
                            Return to Dashboard
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                            onClick={() => navigate(`/AI-Interivew/${interviewId}/start`)}
                        >
                            <FiRefreshCw />
                            Practice Again
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ScorePage;