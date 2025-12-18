package com.example.EventEase.Repository;

import com.example.EventEase.Entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Basic CRUD operations are inherited
    List<Event> findByAdminEmail(String email);
    List<Event> findByOrganizationName(String orgName);
}