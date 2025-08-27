package com.tweak.my.resume.tweak_my_resume.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @GetMapping("my-resumes")
    public String myResumes(){
        return "my-resumes";
    }
}
