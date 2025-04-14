import { useState } from "react";

const faqs = [
  {
    question: "How can I change my profile name?",
    answer:
      "To change your profile name, go to the 'Edit Profile' page and go to Accounts section. Click on Edit button, enter your new profile name and then click 'update' button to update your profile name."
  },
  {
    question: "Why am I seeing a yellow warning and unable to fetch my profile handle?",
    answer:
      "If you encounter a yellow warning and are unable to fetch your profile handle, it could be due to one of the following reasons:\n- The profile handle entered is incorrect.\n- The page is temporarily unavailable.\n- Your profile is set to private on the respective platform.\nPlease verify your profile handle and check the platform's settings. If the issue persists, try again later."
  },
  {
    question: "Which coding platforms are supported?",
    answer:
      "We support Leetcode, GeeksforGeeks, CodeStudio, Interviewbit, Codechef, Codeforces, Atcoder, and Hackerrank, allowing you to track your progress across all these platforms in one place."
  },
  {
    question: "How do I connect my coding profiles from different platforms?",
    answer:
      "After signing up, go to the 'Portfolio Tracker' section and access the setup profile page. Here, you can add your user handles for Leetcode, CodeStudio, GeeksforGeeks, Interviewbit, Codechef, Codeforces, and Hackerrank. Alternatively, if you prefer to add or update your profiles later, navigate to the 'Edit Profile' section, select 'Platform,' and enter your user handles for the desired platforms."
  },
  {
    question: "What should I do if I encounter an error connecting my LeetCode profile?",
    answer:
      "If you encounter an error while connecting your LeetCode profile, follow these steps:\n1. Go to LeetCode and navigate to Edit Profile.\n2. Under the Privacy section, find the option Display my submission history.\n3. Mark it as 'Yes' and click 'Save'.\n4. Retry fetching your profile on Codolio.\nIf the issue persists, please contact our support team at support@codolio.com for further assistance."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold leading-10 tracking-tight text-center text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-10 space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="pb-4 border-b border-gray-300">
            <div
              className="flex items-center justify-between p-2 font-medium cursor-pointer sm:text-lg"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-[500] dark:text-darkText-400">{faq.question}</span>
              <span className="text-gray-900 dark:text-darkText-500">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>
            <div
              className={`px-2 overflow-hidden dark:text-darkText-500 transition-all duration-300 ${
                openIndex === index ? "h-auto opacity-100" : "h-0 opacity-0"
              }`}
            >
              <p className="p-2 text-gray-700 dark:text-darkText-500 whitespace-pre-line">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}