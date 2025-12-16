package com.example.EventEase.Controller;

import com.example.EventEase.Entity.Booking;
import com.example.EventEase.Service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional; // IMPORTANT: Ensure Optional is imported

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Helper to get authenticated user's email (principal)
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    // Requires ROLE_USER: /api/user/** from SecurityConfig
    @PostMapping("/user/book/{eventId}")
    public ResponseEntity<?> bookEvent(@PathVariable Long eventId, @RequestBody Map<String, Integer> request) {
        String userEmail = getCurrentUserEmail();
        int seatsToBook = request.getOrDefault("seats", 1);

        try {
            // FIX: Retrieve the Optional result first.
            Optional<Booking> bookingOpt = bookingService.bookSeats(eventId, userEmail, seatsToBook);

            // Then, construct the ResponseEntity based on presence.
            if (bookingOpt.isPresent()) {
                return ResponseEntity.status(201).body(bookingOpt.get());
            } else {
                // Returns 404 with a String body when Event or User is not found.
                return ResponseEntity.status(404).body("Event or User not found.");
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Booking failed due to an internal error: " + e.getMessage());
        }
    }

    // Requires ROLE_USER: /api/user/**
    @GetMapping("/user/mybookings")
    public ResponseEntity<List<Booking>> getMyBookings() {
        String userEmail = getCurrentUserEmail();
        try {
            List<Booking> bookings = bookingService.findMyBookings(userEmail);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            // If user is not found, although authentication should prevent this, returning 404 is appropriate.
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId) {
        // Authorization is handled by SecurityConfig (ROLE_ADMIN is required for /admin/**)

        List<Booking> bookings = bookingService.findAllBookingsByUserId(userId);

        if (bookings.isEmpty()) {
            // Returning 200 OK with an empty list is generally preferred over 404
            // when the user exists but has no results.
            return ResponseEntity.ok(bookings);
        }
        return ResponseEntity.ok(bookings);
    }
}