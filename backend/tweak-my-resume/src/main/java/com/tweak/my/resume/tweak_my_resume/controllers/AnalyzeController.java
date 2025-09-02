package com.tweak.my.resume.tweak_my_resume.controllers;

import com.tweak.my.resume.tweak_my_resume.services.AiService;
import com.tweak.my.resume.tweak_my_resume.services.AnalyzeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/analyze")
public class AnalyzeController {

    private final AnalyzeService analyzeService;
    public AnalyzeController(AnalyzeService analyzeService) {
        this.analyzeService = analyzeService;
    }

    // POST /api/analyze  (body: { "resumeText": "..." }). Just for resume (testing)
    @PostMapping(value = "/resume", consumes = "application/json", produces = "application/json")
    public String analyze(@AuthenticationPrincipal OAuth2User principal,
                          @RequestBody ResumeOnlyRequest body) {

        // Debug: who called + payload size
        String email = principal != null ? (String) principal.getAttribute("email") : "unknown";
        System.out.println("Analyze called by: " + email);

        String reply = analyzeService.analyzeResume(body.resumeText, null);
        return reply;
    }

    // sending resume + job desc to AI
    @PostMapping(value = "/tailor", consumes = "application/json", produces = "application/json")
    public String tailorResume(@AuthenticationPrincipal OAuth2User principal, @RequestBody AnalyzeRequest body) {
        String email = principal != null ? (String) principal.getAttribute("email") : "unknown";
        System.out.println("Analyze called by: " + email);
        return analyzeService.analyzeResume(body.resumeText, body.jobDescription);
    }

    // Minimal request DTO
    public static class ResumeOnlyRequest {
        public String resumeText; // public field -> Jackson can bind without getters/setters
    }
    public static class AnalyzeRequest {
        public String resumeText;
        public String jobDescription;
    }
}
