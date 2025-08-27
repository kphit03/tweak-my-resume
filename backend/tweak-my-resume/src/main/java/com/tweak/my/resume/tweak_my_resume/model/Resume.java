package com.tweak.my.resume.tweak_my_resume.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "resume")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private ApplicationUser user;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false)
    private java.time.Instant uploadedAt = java.time.Instant.now();

    @Column(nullable = false)
    private String storageUrl;   // external storage
}