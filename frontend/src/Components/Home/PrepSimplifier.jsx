import { Link } from "react-router-dom";

const PrepSimplifier = () => {
    const features = [
        {
            title: "My Workspace",
            description: "Tag & filter questions for easy organization",
            imgSrc: "https://codolio.com/_next/image?url=%2Flanding%2Fworkspace_light.png&w=256&q=75",
            imgWidth: 80,
            link: "/question-tracker/workspace",
        },
        {
            title: "Sheet Tracker",
            description: "Track all coding sheets in one place",
            imgSrc: "https://codolio.com/_next/image?url=%2Flanding%2Fsheet_tracker_light.png&w=96&q=75",
            imgWidth: 48,
            link: "/question-tracker/mySheets",
        },
        {
            title: "Enhanced Notes",
            description: "Add detailed notes to questions easily.",
            imgSrc: "https://codolio.com/_next/image?url=%2Flanding%2Fnotes_light.png&w=96&q=75",
            imgWidth: 48,
            link: "/question-tracker/notes",
        },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Header Section */}
            <div className="text-center md:text-left">
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    Simplify Your Prep
                </h3>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
                    Say goodbye to last-minute stress. Track all your questions and notes in one place for easy review and revision.
                </p>
                <Link to="/question-tracker" className="mt-4 inline-block text-lg font-semibold text-blue-600 hover:underline">
                    Try Question Tracker →
                </Link>
            </div>

            {/* Features Section */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Link key={index} to={feature.link}>
                        <div className="flex flex-col items-center bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg dark:shadow-gray-800 transition-transform transform hover:scale-105 cursor-pointer">
                            <img 
                                alt={feature.title}
                                loading="lazy"
                                width={feature.imgWidth}
                                decoding="async"
                                className="w-16 h-16 mb-4"
                                src={feature.imgSrc}
                            />
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                                {feature.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PrepSimplifier;
