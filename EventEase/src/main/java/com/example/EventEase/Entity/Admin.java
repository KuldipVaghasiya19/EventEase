package com.example.EventEase.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "booking_seq")
    @SequenceGenerator(name = "booking_seq", sequenceName = "admin_id_seq", initialValue = 102541, allocationSize = 5)
    private Long id;

    @NonNull
    private String name;

    @NonNull
    private String location;

    @NonNull
    private String email;

    @NonNull
    private String password;

    private String contact;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Event> createdEvents;

    private final String role = "ADMIN";
}