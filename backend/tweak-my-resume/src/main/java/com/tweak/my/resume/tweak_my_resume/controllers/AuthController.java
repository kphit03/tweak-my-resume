package com.tweak.my.resume.tweak_my_resume.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.Collections;
import java.util.Map;

/**
 * This class tells the frontend whether user is logged in
 */
@CrossOrigin(origins= "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/public")
    public String notProtected() {
        return "Not protected";
    }

    @GetMapping("/protected")
    public String protectedAuth() {
        return "Hello protected";
    }

    @GetMapping("/user")
    /**Inject the currently logged-in user into this method
     * OAuth2User is a spring security object that represents an authenticated user from OAuth2
     *  - it has methods like principal.getAttributes(), pricipal.getAuthorities(), can find more info online
     */
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        //creates tiny json object "name": "Kevin Phitsanu"
        System.out.println("Get Authorities:" + principal.getAuthorities());
        System.out.println("Get Attributes:" + principal.getAttributes());
//        return Collections.singletonMap("attributes", principal.getAttributes());
        return Collections.singletonMap("Attributes", principal.getAttributes());
    }
}
