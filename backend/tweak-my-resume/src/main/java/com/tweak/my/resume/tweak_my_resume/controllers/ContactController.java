package com.tweak.my.resume.tweak_my_resume.controllers;


import com.tweak.my.resume.tweak_my_resume.services.EmailService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    //dto format of request
    public static class ContactRequest {
        @NotBlank public String name;
        @Email @NotBlank public String email;
        public String subject;
        @NotBlank public String message;
    }

    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void submit(@RequestBody ContactRequest request) {
        // TODO: add CAPTCHA + rate limit before sending
        emailService.sendContactEmail(request.name, request.email, request.subject, request.message);
    }
}
