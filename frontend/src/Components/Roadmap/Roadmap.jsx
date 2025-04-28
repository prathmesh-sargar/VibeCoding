import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const RoadmapForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/create/roadmap",
        data
      ); // Adjust the backend URL as needed
      setRoadmap(response.data.roadmap);
    } catch (error) {
      console.error("Error generating roadmap:", error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Personalized Learning Roadmap
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Goal */}
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700"
            >
              Goal
            </label>
            <input
              type="text"
              id="goal"
              {...register("goal", { required: "Goal is required" })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            {errors.goal && (
              <p className="text-red-500 text-sm">{errors.goal.message}</p>
            )}
          </div>

          {/* Skill Level */}
          <div>
            <label
              htmlFor="skillLevel"
              className="block text-sm font-medium text-gray-700"
            >
              Skill Level
            </label>
            <select
              id="skillLevel"
              {...register("skillLevel", {
                required: "Skill Level is required",
              })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Skill Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {errors.skillLevel && (
              <p className="text-red-500 text-sm">
                {errors.skillLevel.message}
              </p>
            )}
          </div>

          {/* Available Time Per Week */}
          <div>
            <label
              htmlFor="availableTimePerWeek"
              className="block text-sm font-medium text-gray-700"
            >
              Available Time Per Week (hours)
            </label>
            <input
              type="number"
              id="availableTimePerWeek"
              {...register("availableTimePerWeek", {
                required: "Available time is required",
                min: 1,
              })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
            {errors.availableTimePerWeek && (
              <p className="text-red-500 text-sm">
                {errors.availableTimePerWeek.message}
              </p>
            )}
          </div>

          {/* Learning Style */}
          <div>
            <label
              htmlFor="learningStyle"
              className="block text-sm font-medium text-gray-700"
            >
              Learning Style
            </label>
            <select
              id="learningStyle"
              {...register("learningStyle", {
                required: "Learning Style is required",
              })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Learning Style</option>
              <option value="Visual">Visual (Learn by seeing)</option>
              <option value="Auditory">Auditory (Learn by listening)</option>
              <option value="Kinesthetic">Kinesthetic (Learn by doing)</option>
              <option value="Both">Both Practical & Theoretical</option>
            </select>
            {errors.learningStyle && (
              <p className="text-red-500 text-sm">
                {errors.learningStyle.message}
              </p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center">
        <div className="w-[900px]">
          {roadmap &&
            roadmap.map((stage, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 mb-8 transition-transform transform hover:scale-105"
              >
                <h2 className="text-3xl font-semibold text-blue-600">
                  {stage.stage}
                </h2>
                <p className="text-gray-600 mt-2">{stage.description}</p>
                <p className="text-gray-700 mt-4 font-medium">
                  Duration:{" "}
                  <span className="text-teal-500">{stage.duration}</span>
                </p>
                <h3 className="text-xl font-semibold mt-4">Topics to Learn:</h3>
                <ul className="list-disc ml-5 mt-2 text-gray-700">
                  {stage.topics_to_learn.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
                <h3 className="text-xl font-semibold mt-4">Action Steps:</h3>
                <ul className="list-decimal ml-5 mt-2 text-gray-700">
                  {stage?.action_steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
                <p className="text-gray-600 mt-4">
                  {stage?.motivation_reminder}
                </p>
                <h3 className="text-xl font-semibold mt-4">Resources:</h3>
                <ul className="list-none ml-5 mt-2 text-blue-600">
                  {stage?.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-4">
                  <span className="text-teal-500">
                    {stage.difficulty_level}
                  </span>
                </p>
                <p className="text-gray-700 mt-2">{stage.expected_outcome}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
export default RoadmapForm;
