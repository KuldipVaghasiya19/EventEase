package com.example.EventEase.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.NonNull;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Changed from String id (MongoDB) to Long id (JPA)

    @NonNull
    private String name;

    @NonNull
    private String location;

    @NonNull
    private String email;

    @NonNull
    private String password;

    private String contact;

    private final String role = "ADMIN";
}