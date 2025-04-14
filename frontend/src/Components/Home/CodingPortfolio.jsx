import React from "react";

const CodingPortfolio = () => {
  return (
    <section className="mt-4 flex flex-col items-center justify-center w-full px-4 md:px-10 lg:px-16 gap-6">
      <div className="flex flex-col items-center w-full text-center md:text-left md:items-start gap-4">
        <h3 className="text-3xl font-semibold text-center md:text-start md:text-5xl dark:text-white">
          Your <span className="text-orange-500">All-in-One </span>Coding
          Portfolio
        </h3>

        <a
          href="/profile/YoZzXkbH"
          className="font-semibold text-btnBlue hover:underline"
        >
          Try Profile Tracker →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <FeatureCard
          title="See cumulative questions solved"
          image="https://codolio.com/_next/image?url=%2Flanding%2Ftotal_questions_light.png&w=256&q=75"
        />
        <FeatureCard title="Track your streak, across multiple platforms">
          <div className="flex flex-col xl:flex-row gap-4">
            <ImageWrapper
              src="https://codolio.com/_next/image?url=%2Flanding%2Ftotal_active_days_light.png&w=256&q=75"
              alt="feature1"
            />
            <ImageWrapper
              src="https://codolio.com/landing/heatmap_light.png"
              alt="heatmap"
            />
          </div>
        </FeatureCard>

        <FeatureCard
          title="Identify your strengths and areas of improvement"
          image="https://codolio.com/_next/image?url=%2Flanding%2Ftopic_analysis_light.png&w=640&q=75"
        />
        <FeatureCard
          title="Get classification of Problems solved"
          image="https://codolio.com/landing/problems_solved_light.png"
        />

        <FeatureCard title="Monitor your ratings in contests over time">
          <div className="flex flex-col gap-4">
            <ImageWrapper
              src="https://codolio.com/landing/contest_description_light.png"
              alt="feature1"
            />
            <ImageWrapper
              src="https://codolio.com/landing/contest_graph_light.png"
              alt="Contest Graph"
            />
          </div>
        </FeatureCard>

        <FeatureCard title="Showcase your Achievements">
          <div className="flex flex-col gap-4">
            <ImageWrapper
              src="https://codolio.com/_next/image?url=%2Flanding%2Fbadges_light.png&w=640&q=75"
              alt="feature1"
            />
            <ImageWrapper
              src="https://codolio.com/_next/image?url=%2Flanding%2Fcontest_ratings_light.png&w=640&q=75"
              alt="feature1"
            />
          </div>
        </FeatureCard>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, image, children }) => {
  return (
    <div className="flex flex-col flex-1 gap-4 p-6 text-center bg-gray-100 border dark:bg-darkBox-800 dark:border-darkBorder-700 rounded-lg shadow-md overflow-hidden">
      <h4 className="text-lg font-medium">{title}</h4>
      {image && <ImageWrapper src={image} alt={title} />}
      {children}
    </div>
  );
};

const ImageWrapper = ({ src, alt }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <img
        src={src}
        alt={alt}
        className="w-full max-w-[300px] h-auto object-contain border rounded-lg dark:border-darkBorder-700"
      />
    </div>
  );
};

export default CodingPortfolio;