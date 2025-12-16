package com.example.EventEase.Controller;

import com.example.EventEase.Entity.Admin;
import com.example.EventEase.Entity.User;
import com.example.EventEase.Service.AdminService;
import com.example.EventEase.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminService adminService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthController(AdminService adminService,
                          UserService userService,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager) {
        this.adminService = adminService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    // --- Registration Endpoints ---

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        Admin savedAdmin = adminService.createAdmin(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // --- Login Endpoints ---

    @PostMapping("/login/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody Admin loginRequest, HttpServletRequest httpRequest) {
        Optional<Admin> adminOptional = adminService.findByEmail(loginRequest.getEmail());
        if (adminOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Admin not found");
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), adminOptional.get().getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        httpRequest.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

        System.out.println("Successfully login admin");
        return ResponseEntity.ok(adminOptional.get());
    }

    @PostMapping("/login/user")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest, HttpServletRequest httpRequest) {
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        httpRequest.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
        System.out.println("Successfully login user");

        return ResponseEntity.ok(userOpt.get());
    }
}