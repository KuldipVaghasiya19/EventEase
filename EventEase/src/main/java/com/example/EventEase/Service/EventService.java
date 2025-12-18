package com.example.EventEase.Service;

import com.example.EventEase.Entity.Admin;
import com.example.EventEase.Entity.Event;
import com.example.EventEase.Repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // --- ADMIN CRUD OPERATIONS ---

    /**
     * Creates a new event and links it to the creating Admin.
     * * @param event The event entity from the request body.
     * @param admin The authenticated Admin entity.
     * @return The saved Event.
     */
    public Event createEvent(Event event, Admin admin) {
        // Validation for totalSeats (now Integer)
        if (event.getTotalSeats() == null || event.getTotalSeats() <= 0) {
            throw new IllegalArgumentException("Total seats must be a positive number.");
        }

        event.setAdmin(admin); // Link the event to the creating admin
        event.setBookedSeats(0); // Ensure booked seats start at 0

        return eventRepository.save(event);
    }

    /**
     * Updates an existing event, including seat count validation.
     * * @param id The ID of the event to update.
     * @param updatedEvent The event entity with updated data.
     * @return Optional containing the updated Event, or empty if not found.
     */
    public Optional<Event> updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {

            // Check for null before updating total seats
            if (updatedEvent.getTotalSeats() != null) {
                if (updatedEvent.getTotalSeats() < event.getBookedSeats()) {
                    throw new IllegalArgumentException("New total seats cannot be less than currently booked seats (" + event.getBookedSeats() + ").");
                }
                event.setTotalSeats(updatedEvent.getTotalSeats());
            }

            // Update all other fields
            event.setName(updatedEvent.getName());
            event.setAbout(updatedEvent.getAbout());
            event.setTags(updatedEvent.getTags());
            event.setOrganizationName(updatedEvent.getOrganizationName());
            event.setDate(updatedEvent.getDate());
            event.setVenue(updatedEvent.getVenue());

            return eventRepository.save(event);
        });
    }

    /**
     * Deletes an event by ID.
     * * @param id The ID of the event to delete.
     * @return true if deleted, false if not found.
     */
    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // --- PUBLIC READ OPERATIONS ---

    public List<Event> findAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> findEventById(Long id) {
        return eventRepository.findById(id);
    }

    public List<Event> findEventsByAdminEmail(String email) {
        return eventRepository.findByAdminEmail(email);
    }
}