package com.example.EventEase.Controller;

import com.example.EventEase.Entity.Booking;
import com.example.EventEase.Entity.Event;
import com.example.EventEase.Entity.User;
import com.example.EventEase.Repository.BookingRepository;
import com.example.EventEase.Repository.EventRepository;
import com.example.EventEase.Service.BookingService;
import com.example.EventEase.Service.UserService;
import org.springframework.http.HttpStatus;
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


    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @PostMapping("/reserve/{eventId}")
    public ResponseEntity<?> bookTicket(@PathVariable Long eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        Optional<Event> eventOpt = eventRepository.findById(eventId);

        if (userOpt.isEmpty() || eventOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Event not found");
        }

        User user = userOpt.get();
        Event event = eventOpt.get();

        if (bookingRepository.existsByUserAndEvent(user, event)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("You have already booked a ticket for this event.");
        }

        if (event.getBookedSeats() >= event.getTotalSeats()) {
            return ResponseEntity.badRequest().body("No seats available.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setBookingTime(LocalDateTime.now());
        booking.setSeatsBooked(1);

        event.setBookedSeats(event.getBookedSeats() + 1);

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
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId) {

        List<Booking> bookings = bookingService.findAllBookingsByUserId(userId);

        if (bookings.isEmpty()) {

            return ResponseEntity.ok(bookings);
        }
        return ResponseEntity.ok(bookings);
    }


    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUserOpt = userService.findByEmail(email);

        if (currentUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User session not found");
        }

        User currentUser = currentUserOpt.get();

        return bookingRepository.findById(bookingId).map(booking -> {


            if (!booking.getUser().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access Denied: You do not own this booking");
            }


            Event event = booking.getEvent();
            if (event != null) {
                event.setBookedSeats(Math.max(0, event.getBookedSeats() - 1));
                eventRepository.save(event);
            }


            bookingRepository.delete(booking);
            return ResponseEntity.ok("Booking cancelled successfully");

        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found"));
    }

    @GetMapping("/admin/registrations")
    public ResponseEntity<List<Booking>> getAdminEventRegistrations(
            @RequestParam(required = false) Long eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        if (eventId != null) {
            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isPresent() && eventOpt.get().getAdmin().getEmail().equals(email)) {
                return ResponseEntity.ok(eventOpt.get().getBookings());
            }
            return ResponseEntity.ok(new ArrayList<>());
        }

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