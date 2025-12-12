package com.example.EventEase.Controller;

import com.example.EventEase.DTOs.AuthRequest;
import com.example.EventEase.DTOs.AuthResponse;
import com.example.EventEase.DTOs.RegisterRequest;
import com.example.EventEase.Entity.User;
import com.example.EventEase.Repository.UserRepository;
import com.example.EventEase.Security.JwtUtil;
import com.example.EventEase.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserService userService,
                          UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        User created = userService.register(req);
        return ResponseEntity.ok("User registered: " + created.getUsername());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );
        // load user from DB for roles
        var user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after auth"));

        var roleNames = user.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
        String token = jwtUtil.generateToken(user.getUsername(), roleNames);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
