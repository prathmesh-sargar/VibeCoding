import React from 'react'

function Analysis() {
    return (
       
            <div className="w-full p-3 md:p-4 overflow-auto border-none shadow-sm lg:mb-8 no-scrollbar md:border lg:h-screen dark:bg-dark-900 dark:border-darkBorder-800">
                <section className="w-full md:mb-10 md:p-4">
                    <div className="flex flex-col items-center justify-center text-gray-500 min-h-[70vh]">
                        {/* Image */}
                        {/* <img
                            src="https://codolio.com/question_tracker/tour/QuestionTrackerTour-6.png"
                            alt="No Data"
                            className="w-[30rem] h-auto"
                        /> */}

                        {/* Heading */}
                        <p className="text-black dark:text-darkText-300 text-4xl font-medium mt-4">
                            Unlock Your Insights
                        </p>

                        {/* Description */}
                        <p className="text-gray-600 font-medium dark:text-darkText-400 text-center mt-2">
                            Add solved questions to your workspace to track progress and see insights!
                        </p>
                    </div>
                </section>
            </div>
        
    )
}

export default Analysis
