package com.example.EventEase.Controller;

import com.example.EventEase.Entity.Admin;
import com.example.EventEase.Entity.Event;
import com.example.EventEase.Service.AdminService;
import com.example.EventEase.Service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final AdminService adminService; // Required to fetch the Admin entity

    public EventController(EventService eventService, AdminService adminService) {
        this.eventService = eventService;
        this.adminService = adminService;
    }

    // Helper method to get the email (principal) of the currently authenticated user
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    // --- ADMIN ENDPOINTS (Requires ROLE_ADMIN) ---

    @PostMapping("/admin")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        String adminEmail = getCurrentUserEmail();

        try {
            // 1. Fetch the Admin entity using the authenticated email
            Admin admin = adminService.findByEmail(adminEmail)
                    .orElseThrow(() -> new IllegalStateException("Authenticated Admin not found."));

            // 2. Pass both event and admin to the service
            Event createdEvent = eventService.createEvent(event, admin);

            return ResponseEntity.status(201).body(createdEvent);
        } catch (IllegalArgumentException e) {
            // Catches validation errors from the service (e.g., totalSeats <= 0)
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        try {
            Optional<Event> eventOptional = eventService.updateEvent(id, updatedEvent);

            return eventOptional.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            // Catches validation errors from the service (e.g., totalSeats < bookedSeats)
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventService.deleteEvent(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- PUBLIC READ ENDPOINTS (Requires no role) ---

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.findAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.findEventById(id);

        return event.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // src/main/java/com/example/EventEase/Controller/EventController.java

    // Add this mapping inside the EventController class
    @GetMapping("/admin/my-events")
    public ResponseEntity<List<Event>> getMyEvents(Authentication authentication) {
        // authentication.getName() retrieves the email/username of the logged-in admin
        String adminEmail = authentication.getName();
        List<Event> myEvents = eventService.findEventsByAdminEmail(adminEmail);
        return ResponseEntity.ok(myEvents);
    }
}