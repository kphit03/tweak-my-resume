package com.tweak.my.resume.tweak_my_resume.controllers;

import com.tweak.my.resume.tweak_my_resume.services.AuthSyncService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
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
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthSyncService authSyncService;
    public AuthController(AuthSyncService authSyncService) {
        this.authSyncService = authSyncService;
    }

    //return user info and add to DB
    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal OAuth2User principal, OAuth2AuthenticationToken authToken) {
        //Which provider used? (etc google)
        String provider = authToken.getAuthorizedClientRegistrationId(); //sets provider to "google"

//        System.out.println("PRINCIPAL: " + principal);
        var user = authSyncService.upsertFromOAuth(provider, principal.getAttributes());
//        System.out.println(
//                "User => id=" + user.getId()
//                        + ", firstName=" + user.getFirstName()
//                        + ", lastName=" + user.getLastName()
//                        + ", email=" + user.getEmail()
//                        + ", provider=" + user.getProvider()
//                        + ", providerId=" + user.getProviderId()
//        );
        return Map.of(
                "id", user.getId(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail()
        );
    }

}
