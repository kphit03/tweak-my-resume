package com.tweak.my.resume.tweak_my_resume.services;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.contact.to}")
    private String toAddress;

    @Value("${app.contact.from}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactEmail(String fromName, String fromEmail, String subject, String message) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(mime, true, "UTF-8");

            // Escape user input to avoid HTML injection in inbox
            String safeName = HtmlUtils.htmlEscape(fromName == null ? "" : fromName);
            String safeEmail = HtmlUtils.htmlEscape(fromEmail == null ? "" : fromEmail);
            String safeSubject = HtmlUtils.htmlEscape(subject == null ? "" : subject);
            String safeMessage = HtmlUtils.htmlEscape(message == null ? "" : message).replace("\n", "<br/>");

            String html = """
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
          <p><b>Name:</b> %s</p>
          <p><b>Email:</b> %s</p>
          <p><b>Subject:</b> %s</p>
          <hr/>
          <p><b>Message:</b></p>
          <p>%s</p>
        </div>
      """.formatted(safeName, safeEmail, safeSubject, safeMessage);

            String text = """
        Name: %s
        Email: %s
        Subject: %s

        Message:
        %s
      """.formatted(fromName, fromEmail, subject, message);

            h.setTo(toAddress);
            h.setFrom(fromAddress);         // must be the Gmail you configured
            if (fromEmail != null && !fromEmail.isBlank()) {
                h.setReplyTo(fromEmail);      // reply directly to the user
            }
            h.setSubject("[Resume Tailor] " + (safeSubject.isBlank() ? "New message" : safeSubject));
            h.setText(text, html);          // text + HTML alternative

            mailSender.send(mime);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send contact email", e);
        }
    }
}