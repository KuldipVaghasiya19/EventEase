package com.example.EventEase.Repository;

import com.example.EventEase.Entity.Booking;
import com.example.EventEase.Entity.Event;
import com.example.EventEase.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    boolean existsByUserAndEvent(User user, Event event);

    Optional<Booking> findByUserIdAndEventId(Long userId, Long eventId);
}