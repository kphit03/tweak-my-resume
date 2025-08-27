package com.tweak.my.resume.tweak_my_resume.model;

import jakarta.persistence.*;

@Entity
@Table(name="application_user", uniqueConstraints = @UniqueConstraint(columnNames = {"provider","provider_id"}))
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String firstName;

    @Column(nullable=false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable=false)
    private String provider;
    @Column(nullable=false, name="provider_id")
    private String providerId;

    public ApplicationUser() {}
    public ApplicationUser(String firstName, String lastName, String email, String provider, String providerId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.provider = provider;
        this.providerId = providerId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
}
