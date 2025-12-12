package com.example.EventEase.Service;


import com.example.EventEase.DTOs.RegisterRequest;
import com.example.EventEase.Entity.Role;
import com.example.EventEase.Entity.User;
import com.example.EventEase.Repository.UserRepository;
import com.example.EventEase.exception.ApiException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.userRepository = repo;
        this.encoder = encoder;
    }

    public User register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new ApiException("Username already taken");
        }
        Set<Role> roles = (req.getRoles() == null || req.getRoles().isEmpty()) ?
                Set.of(Role.ROLE_USER) :
                req.getRoles().stream()
                        .map(r -> r.equalsIgnoreCase("admin") ? Role.ROLE_ADMIN : Role.ROLE_USER)
                        .collect(Collectors.toSet());

        User user = User.builder()
                .username(req.getUsername())
                .password(encoder.encode(req.getPassword()))
                .roles(roles)
                .build();
        return userRepository.save(user);
    }
}