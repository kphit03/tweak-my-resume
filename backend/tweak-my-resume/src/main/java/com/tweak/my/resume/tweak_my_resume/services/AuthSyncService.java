package com.tweak.my.resume.tweak_my_resume.services;

import com.tweak.my.resume.tweak_my_resume.model.ApplicationUser;
import com.tweak.my.resume.tweak_my_resume.repositories.ApplicationUserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthSyncService {

    private final ApplicationUserRepository applicationUserRepository;

    public AuthSyncService(ApplicationUserRepository applicationUserRepository) {
        this.applicationUserRepository = applicationUserRepository;
    }

    /**
     * Upsert = find existing user by (provider, providerId) or create a new one.
     * Returns the persisted ApplicationUser (has DB id).
     * "Transactional" wraps the method in a DB transaction
     * --- all the db reads/writes will occur in one transaction, if anything fails, spring rolls back so it's not half written
     */

    @Transactional
    public ApplicationUser upsertFromOAuth(String provider, Map<String, Object> a) {
        // Extract the bits we care about from OAuth2 (Google right now) attributes
        // Data flow: Caller passes the raw OAuth attributes and which provider they came from
        String providerId = (String) a.get("sub");
        String email = (String) a.get("email");
        String givenName = (String) a.get("given_name");
        String familyName = (String) a.get("family_name");
        String fullName   = (String) a.get("name"); //fallback if needed

        //ensure first/last names are not null (to match my entity)
        // if givenName(the first name) and familyName(the last name) are missing, split name (the full name variable)
        if (givenName == null || familyName == null) {
            if (fullName != null && fullName.contains(" ")) {
                String[] parts = fullName.split("\\s+", 2);
                if (givenName == null)  givenName  = parts[0];
                if (familyName == null) familyName = (parts.length > 1) ? parts[1] : "";
            } else {
                //if that fails, fall back to full name, then email, then else go for "User"
                if (givenName == null)  {
                    givenName  = (fullName != null ? fullName : (email != null ? email : "User"));
                }
                if (familyName == null) {
                    familyName = "";
                }
            }
        }
        // step 1: try to find existing user by provider and providerId
        Optional<ApplicationUser> existingUser = applicationUserRepository.findByProviderAndProviderId(provider, providerId);
        if (existingUser.isPresent()) {
            ApplicationUser user = existingUser.get();
            //keep basic profile fresh on login
            user.setFirstName(givenName);
            user.setLastName(familyName);
            if (email != null) {
                user.setEmail(email);
            }
            return applicationUserRepository.save(user); //return the managed entity
        }
        //for ref, here is what ApplicationUser contructor passes public ApplicationUser(String firstName, String lastName, String email, String provider, String providerId)
        ApplicationUser newUser = new ApplicationUser(
                givenName, familyName, email, provider, providerId
        );
        return applicationUserRepository.save(newUser);
    }
}
