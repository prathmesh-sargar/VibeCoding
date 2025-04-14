import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { setAIquestions } from "../../Features/Auth/interviewSlice";

export default function JobForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const getAIquestions = useSelector((state) => state.interview?.AIquestions);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setSubmitError(null);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/aiinterview/create`,
                data
            );
            dispatch(setAIquestions(response.data.newInterview));
            navigate(`/AI-Interivew/${response?.data?.newInterview._id}`);
        } catch (error) {
            console.error(error);
            setSubmitError("Failed to create interview. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 to-gray-100">
           
                

                <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                    <motion.form
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-200"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Create New Interview</h2>
                            <p className="text-gray-600 mt-2">Fill in the details to generate AI interview questions</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Role <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("jobRole", { required: "Job role is required" })}
                                    placeholder="e.g. Software Engineer, Product Manager"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.jobRole ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                {errors.jobRole && (
                                    <p className="mt-1 text-sm text-red-600">{errors.jobRole.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    {...register("jobDescription", {
                                        required: "Job description is required",
                                    })}
                                    rows={4}
                                    placeholder="Paste the job description here..."
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.jobDescription ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                {errors.jobDescription && (
                                    <p className="mt-1 text-sm text-red-600">{errors.jobDescription.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Experience Level (years) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    {...register("experienceLevel", {
                                        required: "Experience level is required",
                                        min: { value: 0, message: "Experience cannot be negative" },
                                    })}
                                    placeholder="e.g. 3"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.experienceLevel ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                />
                                {errors.experienceLevel && (
                                    <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>
                                )}
                            </div>

                            {submitError && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                    {submitError}
                                </div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: isLoading ? 1 : 1.03 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className={`w-full py-3 px-4 rounded-xl text-white font-medium shadow-md ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Questions...
                                    </div>
                                ) : (
                                    "Generate Interview Questions"
                                )}
                            </motion.button>
                        </div>
                    </motion.form>
                </div>
            
        </div>
    );
}