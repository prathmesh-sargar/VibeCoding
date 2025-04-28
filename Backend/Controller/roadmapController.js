import axios from 'axios';

export const generateRoadmap = async (req, res) => {
  try {
    const { goal, skillLevel, availableTimePerWeek, learningStyle } = req.body;

    // Check if any required field is missing
    if (!goal || !skillLevel || !availableTimePerWeek || !learningStyle) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Build dynamic prompt
    const prompt = `
You are a personal mentor helping a user create a personalized skill roadmap.

Here are the user's details:
- Goal: ${goal}
- Current Skill Level: ${skillLevel}
- Available Time per Week: ${availableTimePerWeek}
- Preferred Learning Style: ${learningStyle}

Create a skill roadmap based on the above details. The roadmap must:
- Be divided into clear stages (around 5-8 stages depending on goal complexity).
- Each stage should include:
    - "stage": Name of the stage (short, inspiring title).
    - "description": What this stage is about (in simple and motivating language).
    - "duration": Estimated time to complete this stage (based on user's available time).
    - "topics_to_learn": A list of important topics the user must focus on in this stage.
    - "action_steps": Step-by-step tasks the user should perform to complete this stage.
    - "motivation_reminder": A small motivational message encouraging the user to complete this stage and move closer to their goal.
    - "resources": 2-3 best online resources (YouTube videos, free courses, books).
    - "difficulty_level": Label the stage as "Easy", "Medium", or "Hard".
    - "expected_outcome": What the user can achieve after completing this stage.

Format the full output as a clean, valid JSON array.

Only return the JSON output.
    `;

    console.log("Request body:", req.body);

    // Call Gemini API
    const geminiResponse = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD0o5aN82ZmXlyoR1wn9NQ2S49bh0vfWYc', 
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    console.log("Gemini API response:", geminiResponse.data);

    // Extract response text
    const modelText = geminiResponse.data.candidates[0]?.content?.parts[0]?.text;

    if (!modelText) {
      return res.status(500).json({ message: 'Failed to get roadmap from Gemini.' });
    }

    // Clean the modelText to remove any unwanted Markdown or formatting
    const cleanModelText = modelText.replace(/```json|```/g, '').trim();

    // Try parsing the cleaned modelText into JSON
    let roadmap;
    try {
      roadmap = JSON.parse(cleanModelText);
    } catch (error) {
      console.error('Invalid JSON format received from Gemini:', error.message);
      return res.status(500).json({ message: 'Invalid roadmap format received.' });
    }
    res.status(200).json({ roadmap });

  } catch (error) {
    console.error('Error generating roadmap:', error.message);
    res.status(500).json({ message: 'Server Error.' });
  }
};
