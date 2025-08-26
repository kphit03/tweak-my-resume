package com.tweak.my.resume.tweak_my_resume.repositories;

import com.tweak.my.resume.tweak_my_resume.model.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
    Optional<ApplicationUser> findByProviderAndProviderId(String provider, String providerId);
    Optional<ApplicationUser> findByEmail(String email);
}
