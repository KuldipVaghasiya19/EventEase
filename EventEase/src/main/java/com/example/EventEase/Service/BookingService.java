package com.example.EventEase.Service;

import com.example.EventEase.Entity.Booking;
import com.example.EventEase.Entity.Event;
import com.example.EventEase.Entity.User;
import com.example.EventEase.Repository.BookingRepository;
import com.example.EventEase.Repository.EventRepository;
import com.example.EventEase.Repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }


    public Optional<Booking> bookSeats(Long eventId, String userEmail, int seatsToBook) {

        Optional<Event> eventOpt = eventRepository.findById(eventId);
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (eventOpt.isEmpty() || userOpt.isEmpty()) {
            return Optional.empty();
        }

        Event event = eventOpt.get();
        User user = userOpt.get();

        int availableSeats = event.getTotalSeats() - event.getBookedSeats();

        if (seatsToBook <= 0 || seatsToBook > availableSeats) {
            throw new IllegalArgumentException("Requested seats (" + seatsToBook + ") are invalid or exceed available seats (" + availableSeats + ").");
        }


        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setUser(user);
        booking.setSeatsBooked(seatsToBook);

        Booking savedBooking = bookingRepository.save(booking);


        event.setBookedSeats(event.getBookedSeats() + seatsToBook);
        eventRepository.save(event);

        return Optional.of(savedBooking);
    }

    public List<Booking> findMyBookings(String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + userEmail);
        }

        return bookingRepository.findByUserId(userOpt.get().getId());
    }

    public List<Booking> findAllBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}