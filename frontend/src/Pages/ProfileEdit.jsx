import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode, SiGeeksforgeeks, SiCodeforces } from "react-icons/si";
import { MdWarning } from "react-icons/md";
import { editUser } from "../Features/Auth/AuthSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileEdit = () => {
    const { user, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [name, setName] = useState(user?.name);
    const [email] = useState(user?.email);
    const [platforms, setPlatforms] = useState({
        github: user?.platforms?.github || "",
        leetcode: user?.platforms?.leetcode || "",
        geeksforgeeks: user?.platforms?.geeksforgeeks || "",
        codeforces: user?.platforms?.codeforces || "",
    });

    useEffect(() => {
        if (user) {
            setName(user.name);
            setPlatforms({
                github: user.platforms?.github || "",
                leetcode: user.platforms?.leetcode || "",
                geeksforgeeks: user.platforms?.geeksforgeeks || "",
                codeforces: user.platforms?.codeforces || "",
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        setPlatforms({ ...platforms, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async () => {
        try {
            const result = dispatch(editUser({ name, platforms }));

            toast.success("Profile updated successfully!");

        } catch (err) {
            toast.error("An unexpected error occurred.");
        }
    };

    return (
        <div className="w-full max-w-4xl mt-20 mx-auto p-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Edit Profile
            </h2>

            {/* Name Section */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                />
            </div>

            {/* Email Section */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full mt-2 px-4 py-3 border rounded-lg shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                />
            </div>

            {/* Platforms Section */}
            <h3 className="text-2xl font-semibold text-center text-gray-800 mt-8 mb-4">
                Coding Platforms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.keys(platforms).map((platform) => (
                    <PlatformItem
                        key={platform}
                        label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                        icon={getPlatformIcon(platform)}
                        value={platforms[platform]}
                        name={platform}
                        onChange={handleInputChange}
                    />
                ))}
            </div>

            {/* Save Button */}
            <button
                onClick={handleSaveChanges}
                className={`w-full mt-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg transition duration-200 shadow-md hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
};

const PlatformItem = ({ icon, label, value, name, onChange }) => (
    <div className="flex items-center gap-3 border p-4 rounded-xl shadow-sm bg-gray-50">
        {icon}
        <span className="font-medium text-gray-700 w-28">{label}</span>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter username"
        />
    </div>
);

const getPlatformIcon = (platform) => {
    const icons = {
        github: <FaGithub className="w-6 h-6 text-gray-800" />,
        leetcode: <SiLeetcode className="w-6 h-6 text-orange-500" />,
        geeksforgeeks: <SiGeeksforgeeks className="w-6 h-6 text-green-600" />,
        codeforces: <SiCodeforces className="w-6 h-6 text-blue-600" />,
    };
    return icons[platform] || <MdWarning className="w-6 h-6 text-gray-800" />;
};

export default ProfileEdit;
