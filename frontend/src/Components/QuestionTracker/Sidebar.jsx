import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { FaClipboardList, FaSearch, FaStickyNote, FaChartBar, FaLayerGroup } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";


const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Toggle dropdown when clicking Menu button
    const handleMenuClick = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <aside className="lg:w-[280px] w-full lg:h-screen flex flex-col justify-between bg-white border-r">
            {/* Small screen dropdown menu */}
            <div className="lg:hidden px-2 py-3 border-b">
                <Button
                    variant="outline"
                    className="flex items-center justify-between w-full text-gray-700 border-gray-300 bg-white"
                    onClick={handleMenuClick}
                >
                    <span className="font-semibold">Menu</span>
                    <FiChevronDown className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} />
                </Button>

                {isOpen && (
                    <div ref={dropdownRef} className="mt-2 bg-white border rounded-lg shadow-md">
                        <NavLinks closeMenu={() => setIsOpen(false)} />
                    </div>
                )}
            </div>

            {/* Large screen sidebar */}
            <div className="hidden lg:block w-[280px]">
                <NavLinks />
            </div>
        </aside>
    );
};

const NavLinks = ({ closeMenu }) => {
    const location = useLocation();

    const links = [
        { to: "/question-tracker/workspace", label: "Workspace", icon: <FaLayerGroup /> },
        { to: "/question-tracker/explore", label: "Explore", icon: <FaSearch /> },
        { to: "/question-tracker/mySheets", label: "My Sheets", icon: <FaClipboardList /> },
        { to: "/question-tracker/notes", label: "Notes", icon: <FaStickyNote /> },
        // { to: "/question-tracker/analysis", label: "Analysis", icon: <FaChartBar /> },
    ];

    return (
        <ul className="flex flex-col gap-2 w-full p-3">
            {links.map(({ to, label, icon }) => (
                <Link key={to} to={to} className="w-full" onClick={closeMenu}>
                    <Button
                        className={`w-full flex items-center gap-3 justify-start px-4 py-3 rounded-lg transition-all
                            text-gray-700 bg-white border border-gray-300
                            hover:bg-gray-100 hover:shadow-md 
                            ${location.pathname === to ? "bg-orange-100 text-orange-600 font-semibold" : ""}`}
                    >
                        {icon} <span>{label}</span>
                    </Button>
                </Link>
            ))}
        </ul>
    );
};

export default Sidebar;
