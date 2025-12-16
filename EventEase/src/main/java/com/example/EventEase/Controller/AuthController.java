package com.example.EventEase.Controller;

import com.example.EventEase.Entity.Admin;
import com.example.EventEase.Entity.User;
import com.example.EventEase.Service.AdminService;
import com.example.EventEase.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException; // New Import
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

    // --- Registration Endpoints (REMAINS THE SAME) ---
    // AuthController.java snippet:
    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword())); // This line hashes the password
        Admin savedAdmin = adminService.createAdmin(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // --- Login Endpoints (FIXED) ---

    @PostMapping("/login/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody Admin loginRequest, HttpServletRequest httpRequest) {

        try {
            // 1. Authenticate using Spring Security. This handles password matching via CustomUserDetailsService.
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // 2. Set the security context for the current session
            SecurityContextHolder.getContext().setAuthentication(auth);
            httpRequest.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            // 3. Return the logged-in user object (for frontend data)
            Optional<Admin> adminOptional = adminService.findByEmail(loginRequest.getEmail());
            if (adminOptional.isPresent()) {
                return ResponseEntity.ok(adminOptional.get());
            } else {
                return ResponseEntity.status(500).body("Authentication succeeded, but user data retrieval failed.");
            }

        } catch (BadCredentialsException e) {
            // Catches invalid password/username attempts (401)
            return ResponseEntity.status(401).body("Invalid email or password.");
        } catch (Exception e) {
            // Catches other issues like user not found in CustomUserDetailsService (401)
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/login/user")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest, HttpServletRequest httpRequest) {

        try {
            // 1. Authenticate using Spring Security.
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // 2. Set the security context for the current session
            SecurityContextHolder.getContext().setAuthentication(auth);
            httpRequest.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            // 3. Return the logged-in user object
            Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(userOpt.get());
            } else {
                return ResponseEntity.status(500).body("Authentication succeeded, but user data retrieval failed.");
            }

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}