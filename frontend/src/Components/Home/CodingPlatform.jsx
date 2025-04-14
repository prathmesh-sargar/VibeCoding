const CodingPlatform = () => {
    return (
      <section className="relative z-0 flex flex-col items-center justify-center w-full gap-8 md:mt-10">
        {/* Background Blur Effects */}
        <div className="hidden dark:block absolute z-[-100] left-0 lg:w-72 top-10 w-0 lg:h-72 h-0 bg-codolioBase rounded-full dark:opacity-10 blur-[120px]"></div>
        <div className="hidden dark:block absolute z-[-100] right-0 lg:w-72 top-40 w-0 lg:h-72 h-0 bg-codolioBase rounded-full dark:opacity-10 blur-[120px]"></div>
  
        {/* Title and Description */}
        <div className="flex flex-col gap-2 text-center">
          <h3 className="text-3xl font-semibold dark:text-white sm:text-5xl">
            Your Favourite Coding Platforms
          </h3>
          <p className="text-center font-[550] text-darkText-400 sm:text-xl md:text-3xl">
            Streamlined in Codolio to simplify your <br /> coding journey
          </p>
        </div>
  
        {/* Image */}
        <div className="relative w-fit">
          <img
            alt="codolio-platforms"
            loading="lazy"
            width="448"
            height="277"
            decoding="async"
            className="w-[100%] mx-auto sm:w-[28rem] md:w-[40rem] h-auto"
            style={{ color: "transparent" }}
            src="https://codolio.com/_next/static/media/coding_platforms_1_dark.87dbfe72.svg"
          />
        </div>
      </section>
    );
  };
  
  export default CodingPlatform;
  