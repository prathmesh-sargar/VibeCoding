import { useState } from "react";
import axios from "axios";
import {
  FaExclamationTriangle,
  FaSpinner,
  FaCheckCircle,
  FaFilePdf,
  FaSearch,
  FaExternalLinkAlt
} from "react-icons/fa";
import { FiUpload, FiAlertCircle } from "react-icons/fi";

function ATSResume() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("React Developer");
  const [jobs, setJobs] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
      setResponse(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please upload a resume (PDF format).");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);
    setJobs([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse(res.data);

      const jobRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jobs?category=${category}`
      );
      setJobs(jobRes.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Smart Resume Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant feedback on your resume's ATS compatibility and discover relevant job opportunities.
          </p>
        </div> */}

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Your Resume (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    {file ? (
                      <div className="flex items-center justify-center space-x-2">
                        <FaFilePdf className="h-10 w-10 text-red-500" />
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {fileName}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <FiUpload className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="application/pdf"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Job Category
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-3 border-gray-300 rounded-md"
                    placeholder="e.g. React Developer, Data Scientist"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !file}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading || !file ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'} transition-colors duration-200`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume & Find Jobs"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {response && (
          <div className="space-y-8">
            {/* Analysis Overview */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-green-100 mr-4">
                    <FaCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                </div>

                {/* Match Percentage */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">ATS Compatibility</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {response.matchPercentage}% Match
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${response.matchPercentage >= 70 ? 'bg-green-500' : response.matchPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${response.matchPercentage}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Your resume matches <span className="font-semibold">{response.matchPercentage}%</span> of the typical requirements for a <span className="font-semibold">"{category}"</span> role.
                  </p>
                </div>

                {/* Strengths */}
                <div className="mb-8">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                      ✓
                    </span>
                    Strengths
                  </h3>
                  <ul className="space-y-3">
                    {response.strengths.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2">•</span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Keywords */}
                <div className="mb-8">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
                      !
                    </span>
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {response.missingKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="mb-6">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      💡
                    </span>
                    Improvement Suggestions
                  </h3>
                  <ul className="space-y-3">
                    {response.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5 mr-2">•</span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                      📄
                    </span>
                    Summary
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {response.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Jobs Section */}
            {jobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Recommended Jobs for "{category}"
                  </h2>
                  <div className="space-y-4">
                    {jobs.map((job, idx) => (
                      <div
                        key={idx}
                        className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start">
                          <img
                            src={job.logo}
                            alt={`${job.company} logo`}
                            className="h-12 w-12 rounded-md object-contain mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {job.duration}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center text-sm text-gray-500">
                                📍 {job.location}
                              </span>
                              <span className="inline-flex items-center text-sm text-gray-500">
                                💰 {job.stipend}
                              </span>
                            </div>
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              View Job <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ATSResume;