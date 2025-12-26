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

    public Event createEvent(Event event, Admin admin) {
        if (event.getTotalSeats() == null || event.getTotalSeats() <= 0) {
            throw new IllegalArgumentException("Total seats must be a positive number.");
        }

        event.setAdmin(admin);
        event.setBookedSeats(0);

        return eventRepository.save(event);
    }


    public Optional<Event> updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {

            if (updatedEvent.getTotalSeats() != null) {
                if (updatedEvent.getTotalSeats() < event.getBookedSeats()) {
                    throw new IllegalArgumentException("New total seats cannot be less than currently booked seats (" + event.getBookedSeats() + ").");
                }
                event.setTotalSeats(updatedEvent.getTotalSeats());
            }

            event.setName(updatedEvent.getName());
            event.setAbout(updatedEvent.getAbout());
            event.setTags(updatedEvent.getTags());
            event.setOrganizationName(updatedEvent.getOrganizationName());
            event.setDate(updatedEvent.getDate());
            event.setVenue(updatedEvent.getVenue());

            return eventRepository.save(event);
        });
    }

    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }

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