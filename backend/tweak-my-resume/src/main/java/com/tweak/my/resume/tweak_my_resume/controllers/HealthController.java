package com.tweak.my.resume.tweak_my_resume.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping("/check")
    public String check() {
        return "Health Endpoint Reached. OK.";
    }
}
