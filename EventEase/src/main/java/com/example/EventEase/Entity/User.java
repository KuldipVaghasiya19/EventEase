package com.example.EventEase.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "booking_seq3")
    // This one line (the @SequenceGenerator) makes your IDs look professional (e.g., 102541, 102542)
    @SequenceGenerator(name = "booking_seq3", sequenceName = "user_id_seq", initialValue = 30104, allocationSize = 5)
    private Long id;

    @NonNull
    private String name;

    @NonNull
    private String email;

    @NonNull
    private String password;

    @NonNull
    private String university;

    @NonNull
    private String course;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean currentlyStudyingOrNot;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // <--- FIX APPLIED
    private List<Booking> bookings;

    private final String role = "USER";
}