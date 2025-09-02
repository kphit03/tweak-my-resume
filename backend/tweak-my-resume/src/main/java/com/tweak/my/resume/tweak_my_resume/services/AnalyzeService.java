package com.tweak.my.resume.tweak_my_resume.services;

import org.springframework.stereotype.Service;

@Service
public class AnalyzeService {
    //dependency injection, we will use the AiService
    private final AiService aiService;
    public AnalyzeService(AiService aiService) {
        this.aiService = aiService;
    }
    public String analyzeResume(String resumeText, String jobDescription) {
        //normalizing inputs
        String resume = normalize(resumeText);
        String jobDesc =  jobDescription == null ? "" : normalize(jobDescription);

        // truncation guard for token budget
        resume = left(resume, 24000); //roughly 6k tokens
        jobDesc = left(jobDesc, 8000); //roughly 2k tokens

        String prompt = """
                You are a concise resume coach. Be specific and actionable.
                
                Task:
                - Based on the resume and job description, return a bulleted list of recommendations
                  to gailor the resume to the job. Include missking skills/keywords and concrete bullet points/rewrites.
                - End with a short summary paragraph.
                - Return ONLY a JSON object with keys: summary, strengths, gaps, tailoredBullets, atsKeywords, and key recommendations.
                - Your response should be in JSON format.
                - The data structure for the JSON should match this Java class: java.util.HashMap
                - Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation.
                
                Job description:
                %s
                
                Resume:
                %s
                """.formatted(jobDesc.isBlank() ? "(None provided)" : jobDescription, resume);
        return aiService.chat(prompt);
    }

    private static String normalize(String s) {
        if (s == null) return "";
        // keep newlines but clean noisy whitespace
        return s.replaceAll("[\\t ]{2,}", " ")
                .replaceAll("\\n{3,}", "\n\n")
                .trim();
    }

    private static String left(String s, int maxChars) {
        return s.length() <= maxChars ? s : s.substring(0, maxChars);
    }


}
