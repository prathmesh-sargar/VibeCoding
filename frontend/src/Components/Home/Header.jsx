import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkAuth, logoutUser } from "../../Features/Auth/AuthSlice";

const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        dispatch(checkAuth());
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <header className={`fixed top-0 left-0 w-full backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg z-50 transition-all duration-300 ${isScrolled ? "bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg" : "bg-white/70 dark:bg-gray-900/70"}`}>
            <div className="flex items-center justify-between px-6 py-4">
                {/* Logo Section */}
                <Link className="flex items-center gap-3" to="/">
                    <h1 className="text-xl font-bold">
                        <span className="text-black dark:text-white">Code</span>
                        <span className="text-blue-600">Minder</span>
                    </h1>
                </Link>

                {/* Centered Navigation */}
                <nav className="hidden md:flex items-center justify-center flex-grow gap-1">
                    <Link className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition" to="/question-tracker">Questions</Link>
                    <Link className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition" to="/event-tracker">Event</Link>
                    <Link className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition" to="/profile">Profile</Link>
                    <Link className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition" to="/resume">Resume</Link>
                    <Link className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition" to="/chat">Ai Guide</Link>
                    <Link className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition" to="/ainterview">AI Interview</Link>
                    <Link className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition" to="/community">Community</Link>
                </nav>

                {/* User Section */}
                {user ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="p-0">
                                <img src={user.profilePic?.url} alt="Profile" className="w-11 h-11 rounded-full border border-gray-300 object-cover hover:scale-110 transition-all duration-200" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-3 bg-white shadow-lg rounded-xl border border-gray-200">
                            <div className="text-center">
                                <p className="text-base font-semibold">{user.name}</p>
                                <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                            <hr className="my-2" />
                            <div className="flex flex-col gap-3">
                                <Link className="text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md transition" to="/profile">Profile</Link>
                                <Link className="text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-md transition" to="/profile/edit">Edit Profile</Link>
                                <Button onClick={handleLogout} variant="destructive" className="w-full mt-2 hover:opacity-90 transition">Log Out</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Link to="/login">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition">Login</Button>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;