import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { jsonrepair } from "jsonrepair";
import Resume from "../Model/Resume.js";

dotenv.config();

// ⛔ Disable worker for Node.js (important!)
pdfjsLib.GlobalWorkerOptions.workerSrc = null;

// 📄 Extract Text from PDF from a Buffer
const extractTextFromPDF = async (buffer) => {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ");
    fullText += text + "\n\n";
  }

  return fullText.trim();
};

// 🤖 Analyze Resume Based on Job Category
const analyzeResumeAgainstCategory = async (resumeText, category ,userId) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert resume evaluator. Given the following resume text, analyze how suitable the candidate is for the job role: "${category}".

Evaluate and return a clean JSON in this format:
{
  "matchPercentage": 0-100,
  "missingKeywords": [],
  "strengths": [],
  "suggestions": [],
  "summary": "short paragraph"
}

Only return the valid JSON. No markdown, no extra text.

Resume Text:
${resumeText}
`;
  handleStoreResumedata(userId, resumeText);
  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    if (responseText.startsWith("```json")) {
      responseText = responseText
        .replace(/^```json\s*/, "")
        .replace(/```$/, "");
    }

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = JSON.parse(jsonrepair(responseText));
    }

    return parsed;
  } catch (error) {
    console.error("❌ Analysis error:", error.message);
    throw new Error("Failed to analyze resume for job category");
  }
};
// 🤖 Analyze Resume Based on Job Category
const handleStoreResumedata = async (userId, resumeText) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const prompt = `
  You are a resume parser. Analyze the following resume text and return all available information in structured JSON format.
  
  Include standard sections:
  - name
  - email
  - phone
  - location
  - summary
  - skills
  - experience (jobTitle, company, startDate, endDate, description)
  - education (degree, institution, startDate, endDate)
  - certifications
  - projects
  
  Also include **any other sections** found in the resume (e.g., languages, awards, volunteer work, publications, interests, etc.).
  
  The JSON should be clean, with section names as keys and values in appropriate formats (strings, arrays, or objects). Return **only** the JSON — no markdown or extra text.
  
  Resume Text:
  ${resumeText}
  `;
  
    try {
      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
  
      if (responseText.startsWith("```json")) {
        responseText = responseText
          .replace(/^```json\s*/, "")
          .replace(/```$/, "");
      }
  
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = JSON.parse(jsonrepair(responseText));
      }
  
      const savedResume = await Resume.findOneAndUpdate(
        { userId },
        { data: parsed, createdAt: new Date() },
        { new: true, upsert: true }
      );
  
      return savedResume; // ✅ return the saved or updated resume
    } catch (error) {
      console.error("❌ Resume parsing error:", error.message);
      throw new Error("Failed to extract structured resume data");
    }
  };
  

// 📤 API Endpoint
const handleanalyzepdf = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const category = req.body.category;
    if (!category) {
      return res.status(400).json({ error: "Job category is required" });
    }
    const userId = req.user.id;
    const resumeText = await extractTextFromPDF(req.file.buffer);
    const evaluation = await analyzeResumeAgainstCategory(resumeText, category ,userId);

    res.json(evaluation);
  } catch (error) {
    console.error("📄 Resume analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze resume",
      details: error.message,
    });
  }
};

export { handleanalyzepdf };
