package com.tweak.my.resume.tweak_my_resume.services;

import com.tweak.my.resume.tweak_my_resume.model.ApplicationUser;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Runs after provider (Google) returns the user profile
 * Upserts ApplicationUser so the DB is correct before any controler/page runs
 */

@Component
public class UpsertingOAuth2UserService extends DefaultOAuth2UserService {

    private final AuthSyncService authSyncService;

    public UpsertingOAuth2UserService(AuthSyncService authSyncService) {
        this.authSyncService = authSyncService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException { //this method called by spring during oauth login flow
        //Delegate spring to call the provider's userinfo endpoint and build an OAuth2User that contains attributes, authorities
        OAuth2User delegate = super.loadUser(userRequest);

        //determine which provider this came from (eg. google)
        String provider = userRequest.getClientRegistration().getRegistrationId();

        //Upsert into our DB using attributes from user (utilizing the authSyncService Method)
        //gets us a Map<String, Object>
        ApplicationUser appUser = authSyncService.upsertFromOAuth(provider, delegate.getAttributes());

        // Make mutable copy of the attributes, the map that comes from delegate ^^, is often unmodifiable
        Map<String, Object> enriched = new HashMap<>(delegate.getAttributes());
        enriched.put("app_user_id", appUser.getId());

        String nameAttrKey = userRequest
                .getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        return new DefaultOAuth2User(delegate.getAuthorities(), enriched, nameAttrKey); //return new principal object that keeps same authorities
    }
}
