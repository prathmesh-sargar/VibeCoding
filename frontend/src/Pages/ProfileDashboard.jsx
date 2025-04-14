import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Avatar } from "./components/ui/avatar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const profileData = {
  name: "Prathmesh Sargar",
  email: "sargarprathmesh007@gmail.com",
  phone: "+91-8010618424",
  linkedin: "linkedin.com/prathmesh-sargar",
  location: "Kolhapur",
  education: {
    degree: "B.Tech in Data Science",
    university: "DYPCET",
    year: "May 2027",
    CGPA: 9.33,
  },
  skills: [
    "JavaScript", "Python", "Java", "React.js", "Tailwind CSS", "Node.js",
    "MongoDB", "Firebase", "MySQL", "Redux", "Numpy", "Pandas", "Git",
  ],
  projects: [
    { name: "FocusZen", description: "An AI-powered productivity app for focus and mindfulness.", techStack: ["MERN Stack", "Gemini API", "Tailwind CSS"] },
    { name: "Project Hub", description: "A platform to showcase and collaborate on projects.", techStack: ["React JS", "Firebase", "Tailwind CSS"] },
    { name: "JobLink", description: "A job portal connecting job seekers and employers.", techStack: ["MERN Stack", "Redux", "Tailwind CSS"] },
  ],
  workExperience: [
    { company: "Tech Innovators", role: "Frontend Developer", duration: "Jan 2023 - Present", description: "Developing scalable UI components and enhancing user experience." },
    { company: "Data Minds", role: "Data Science Intern", duration: "Jun 2022 - Dec 2022", description: "Worked on predictive analytics and data visualization projects." }
  ]
};

const skillData = profileData.skills.map(skill => ({ skill, level: Math.random() * 100 }));

const ProfileDashboard = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 rounded-xl shadow-xl">
      {/* Profile Overview */}
      <Card className="col-span-1 md:col-span-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white" />
            <div>
              <CardTitle className="text-xl font-bold">{profileData.name}</CardTitle>
              <p className="text-sm">📍 {profileData.location}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>📧 {profileData.email}</p>
          <p>📞 {profileData.phone}</p>
          <p>🔗 <a href={`https://${profileData.linkedin}`} className="text-yellow-300">LinkedIn</a></p>
          <p>🎓 {profileData.education.degree}, {profileData.education.university} ({profileData.education.year}) - CGPA: {profileData.education.CGPA}</p>
        </CardContent>
      </Card>

      {/* Skills Chart */}
      <Card className="col-span-1 bg-white shadow-lg border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>🚀 Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillData}>
              <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="level" fill="#4F46E5" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Projects Timeline */}
      <Card className="col-span-1 md:col-span-2 bg-white shadow-lg border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>🛠 Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profileData.projects.map((project, index) => (
              <div key={index} className="relative pl-4 border-l-4 border-gray-300">
                <div className={`absolute -left-2 w-4 h-4 rounded-full bg-indigo-500`}></div>
                <p className="font-semibold text-lg text-indigo-700">{project.name}</p>
                <p className="text-gray-600">{project.description}</p>
                <p className="text-gray-500 text-sm">Tech Stack: {project.techStack.join(", ")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card className="col-span-1 md:col-span-2 bg-white shadow-lg border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle>💼 Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profileData.workExperience.map((experience, index) => (
              <div key={index} className="relative pl-4 border-l-4 border-gray-300">
                <div className="absolute -left-2 w-4 h-4 rounded-full bg-green-500"></div>
                <p className="font-semibold text-lg text-green-700">{experience.role} at {experience.company}</p>
                <p className="text-gray-600">{experience.duration}</p>
                <p className="text-gray-500 text-sm">{experience.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDashboard;
