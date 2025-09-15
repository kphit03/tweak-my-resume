package com.tweak.my.resume.tweak_my_resume.controllers;

import com.tweak.my.resume.tweak_my_resume.services.EmailService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    // DTO for request
    public static class ContactRequest {
        @NotBlank
        @Size(min = 2, max = 80, message = "Name must be between 2 and 80 characters.")
        public String name;

        @Email
        @NotBlank
        @Size(max = 120, message = "Email is too long.")
        public String email;

        // Single line only (no CR/LF) to prevent header injection
        @Size(max = 120, message = "Subject is too long.")
        @Pattern(regexp = "^[^\r\n]*$", message = "Subject must be a single line.")
        public String subject;

        @NotBlank
        @Size(min = 10, max = 4000, message = "Message must be between 10 and 4000 characters.")
        public String message;
    }

    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void submit(@Valid @RequestBody ContactRequest request) {
        // TODO: add CAPTCHA + rate limit before sending

        // (Extra safety) Normalize/strip CRLF from subject before passing to mail layer
        final String safeSubject = request.subject == null
                ? ""
                : request.subject.replace("\r", "").replace("\n", "").trim();

        // Prefer using the validated fields directly; EmailService should also be conservative
        emailService.sendContactEmail(
                request.name.trim(),
                request.email.trim(),
                safeSubject,
                request.message.trim()
        );
    }

    /**
     * Optional: automatically trim all incoming String fields
     * so validation sees trimmed values (e.g., "  " → null when empty).
     * If you add this, you can drop some manual .trim() above.
     */
    @InitBinder
    public void initBinder(org.springframework.web.bind.WebDataBinder binder) {
        org.springframework.beans.propertyeditors.StringTrimmerEditor trimmer =
                new org.springframework.beans.propertyeditors.StringTrimmerEditor(true); // true = convert empty to null
        binder.registerCustomEditor(String.class, trimmer);
    }
}
