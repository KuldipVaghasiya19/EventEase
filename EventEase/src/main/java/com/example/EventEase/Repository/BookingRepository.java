package com.example.EventEase.Repository;

import com.example.EventEase.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Retrieve all bookings for a specific user (My Bookings list)
    List<Booking> findByUserId(Long userId);

    // Check if a user has any active booking for a specific event (optional check)
    Optional<Booking> findByUserIdAndEventId(Long userId, Long eventId);
}