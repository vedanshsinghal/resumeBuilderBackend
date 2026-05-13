const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the controller function
const analyseResume = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;

        const prompt = `
    You are an expert Applicant Tracking System (ATS) and Senior Technical Recruiter.
    Analyze the following structured resume data: ${JSON.stringify(resumeData)}
    Against this target job description: ${jobDescription}

    Provide your response ONLY as a valid JSON object with exactly three keys:
    1. "score": an integer representing the ATS match percentage (0-100).
    2. "strengths": an array of 2-3 short, actionable sentences highlighting the strongest matches.
    3. "improvements": an array of 2-3 short, actionable sentences highlighting missing skills or weak points.
    Do not include any markdown formatting like \`\`\`json.
`;
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(prompt);
        
        const cleanJsonString = result.response.text().replace(/```json/gi, "").replace(/```/gi, "").trim();
        res.status(200).json(JSON.parse(cleanJsonString));

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze resume" });
    }
};

// Export the function
module.exports = { analyseResume };