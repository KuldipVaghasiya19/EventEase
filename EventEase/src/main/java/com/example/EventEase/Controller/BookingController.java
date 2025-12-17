package com.example.EventEase.Controller;

import com.example.EventEase.Entity.Booking;
import com.example.EventEase.Entity.Event;
import com.example.EventEase.Entity.User;
import com.example.EventEase.Repository.BookingRepository;
import com.example.EventEase.Repository.EventRepository;
import com.example.EventEase.Service.BookingService;
import com.example.EventEase.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final BookingService bookingService;

    public BookingController(EventRepository eventRepository, BookingRepository bookingRepository, UserService userService, BookingService bookingService) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.bookingService = bookingService;
    }


    // Helper to get authenticated user's email (principal)
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @PostMapping("/reserve/{eventId}")
    public ResponseEntity<?> bookTicket(@PathVariable Long eventId) {
        // 1. Get logged in user email from Security Context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        Optional<Event> eventOpt = eventRepository.findById(eventId);

        if (userOpt.isEmpty() || eventOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Event not found");
        }

        Event event = eventOpt.get();
        User user = userOpt.get();

        // 2. Check seat availability
        if (event.getBookedSeats() >= event.getTotalSeats()) {
            return ResponseEntity.badRequest().body("No seats available for this event");
        }

        // 3. Create Booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setBookingTime(LocalDateTime.now());
        booking.setSeatsBooked(1);

        // 4. Update Event Booked Seats count
        event.setBookedSeats(event.getBookedSeats() + 1);

        // 5. Save both
        bookingRepository.save(booking);
        eventRepository.save(event);

        return ResponseEntity.ok("Booking confirmed successfully");
    }

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

    // Add this method to your existing BookingController.java

    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        // 1. Identify logged-in user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);

        // 2. Find the booking
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);

        if (bookingOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Booking not found");
        }

        Booking booking = bookingOpt.get();

        // 3. Security Check: Ensure the booking belongs to the requester
        if (!booking.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body("Unauthorized to cancel this booking");
        }

        // 4. Update Event Seat Count (Restore the seat)
        Event event = booking.getEvent();
        int seatsToRestore = booking.getSeatsBooked();
        event.setBookedSeats(Math.max(0, event.getBookedSeats() - seatsToRestore));

        // 5. Delete booking and save event changes
        eventRepository.save(event);
        bookingRepository.delete(booking);

        return ResponseEntity.ok("Booking cancelled and seat restored successfully");
    }

    // src/main/java/com/example/EventEase/Controller/BookingController.java

    @GetMapping("/admin/registrations")
    public ResponseEntity<List<Booking>> getAdminEventRegistrations(
            @RequestParam(required = false) Long eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // If eventId is provided, only get bookings for that event
        if (eventId != null) {
            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isPresent() && eventOpt.get().getAdmin().getEmail().equals(email)) {
                return ResponseEntity.ok(eventOpt.get().getBookings());
            }
            return ResponseEntity.ok(new ArrayList<>());
        }

        // Otherwise, get all bookings for all events of this admin
        List<Event> adminEvents = eventRepository.findByAdminEmail(email);
        List<Booking> allRegistrations = new ArrayList<>();
        for (Event event : adminEvents) {
            if (event.getBookings() != null) {
                allRegistrations.addAll(event.getBookings());
            }
        }
        return ResponseEntity.ok(allRegistrations);
    }
}