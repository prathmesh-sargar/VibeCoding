import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import SheetCard from "./SheetCard";
import axios from "axios";

const MySheets = () => {
    const user = useSelector((state) => state.auth.user);
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?._id) return; // ✅ Corrected user ID check

        axios.get(`${import.meta.env.VITE_API_URL}/api/sheets/followed/list`)
            .then(({ data }) => setSheets(data?.data || []))
            .catch(() => setSheets([]))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return <h3 className="text-2xl font-semibold text-center">Please log in to view your sheets.</h3>;

    return (
        <section className="w-full md:mb-10 md:p-4">
            <h3 className="text-2xl font-semibold text-gray-800">My Sheets</h3>
            <p className="text-sm text-gray-600">Based on your personal and followed sheets</p>

            <h4 className="text-xl font-medium text-gray-600 mt-4">Followed Sheets</h4>

            {loading ? (
                <p className="text-gray-600">Loading sheets...</p>
            ) : sheets.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {sheets.map((sheet) => (
                        <Link key={sheet._id} to={`/question-tracker/explore/sheet/${sheet.id}`}>
                            <SheetCard title={sheet.title} description={sheet.description} questions={sheet.totalQuestions} />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-4 font-semibold text-gray-800 bg-white border rounded-lg shadow">
                    <h3>No Sheets Followed</h3>
                    <p className="text-sm text-gray-600">Get started by following a sheet</p>
                    <Button className="mt-4" onClick={() => window.location.href = "/question-tracker/explore"}>
                        Explore
                    </Button>
                </div>
            )}
        </section>
    );
};

export default MySheets;
