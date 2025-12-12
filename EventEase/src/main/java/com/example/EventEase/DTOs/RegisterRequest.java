package com.example.EventEase.DTOs;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // optional roles (admin/user); if empty -> ROLE_USER
    private Set<String> roles;
}
