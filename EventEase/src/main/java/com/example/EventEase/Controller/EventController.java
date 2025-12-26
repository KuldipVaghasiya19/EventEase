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
    private final AdminService adminService;

    public EventController(EventService eventService, AdminService adminService) {
        this.eventService = eventService;
        this.adminService = adminService;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }


    @PostMapping("/admin")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        String adminEmail = getCurrentUserEmail();

        try {
            Admin admin = adminService.findByEmail(adminEmail)
                    .orElseThrow(() -> new IllegalStateException("Authenticated Admin not found."));

            Event createdEvent = eventService.createEvent(event, admin);

            return ResponseEntity.status(201).body(createdEvent);
        } catch (IllegalArgumentException e) {
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


    @GetMapping("/admin/my-events")
    public ResponseEntity<List<Event>> getMyEvents(Authentication authentication) {
        String adminEmail = authentication.getName();
        List<Event> myEvents = eventService.findEventsByAdminEmail(adminEmail);
        return ResponseEntity.ok(myEvents);
    }
}