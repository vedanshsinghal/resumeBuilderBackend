const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generationConfig = { temperature: 0, responseMimeType: "application/json" };

const deriveRubric = async (model, jobDescription) => {
    const prompt = `
        You are a strict ATS scoring engine.
        Analyze this job description and decide how to distribute 100 points across these criteria:
        - keyword_match: importance of specific skills/tools/technologies mentioned
        - work_experience: relevance of past roles, seniority, domain
        - measurable_achievements: quantified impact, numbers, metrics
        - education_certifications: degree requirements, relevant certifications
        - summary_alignment: how well the candidate's profile targets this role

        Job Description: ${jobDescription}

        Rules:
        - Weights must sum to exactly 100
        - Base weights entirely on what this job values most
        - Do not factor in any resume content

        Return ONLY valid JSON:
        {
            "weights": {
                "keyword_match": <int>,
                "work_experience": <int>,
                "measurable_achievements": <int>,
                "education_certifications": <int>,
                "summary_alignment": <int>
            },
            "reasoning": "<one sentence explaining the distribution>"
        }
    `;

    const result = await model.generateContent({ contents: prompt, generationConfig });
    return JSON.parse(result.response.text());
};

const scoreResume = async (model, resumeData, jobDescription, rubric) => {
    const prompt = `
        You are a strict ATS scoring engine. Follow the rubric exactly.

        Score this resume against the job description using ONLY these weights:
        ${JSON.stringify(rubric.weights)}

        Each criterion must be scored from 0 to its maximum weight.
        Be strict — only award points for what is explicitly present in the resume.

        Resume: ${JSON.stringify(resumeData)}
        Job Description: ${jobDescription}

        Return ONLY valid JSON:
        {
            "rubric_scores": {
                "keyword_match": <int>,
                "work_experience": <int>,
                "measurable_achievements": <int>,
                "education_certifications": <int>,
                "summary_alignment": <int>
            },
            "score": <sum of rubric_scores>,
            "strengths": ["...", "...", "..."],
            "improvements": ["...", "...", "..."]
        }
    `;

    const result = await model.generateContent({ contents: prompt, generationConfig });
    return JSON.parse(result.response.text());
};

const analyseResume = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const rubric = await deriveRubric(model, jobDescription);
        const analysis = await scoreResume(model, resumeData, jobDescription, rubric);

        res.status(200).json({
            ...analysis,
            rubric  // optional: send rubric to frontend so user can see why weights were set
        });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze resume" });
    }
};

module.exports = { analyseResume };