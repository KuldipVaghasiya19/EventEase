package com.example.EventEase.Repository;

import com.example.EventEase.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Basic CRUD operations are inherited
}