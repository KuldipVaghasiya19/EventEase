package com.example.EventEase.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.NonNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String name;

    private String about;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_tags", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "tag_name")
    private Set<String> tags;

    @NonNull
    private String organizationName;

    @NonNull
    private LocalDateTime date;

    @NonNull
    private String venue;

    @NonNull
    // FIX: Changed 'int' to 'Integer'
    private Integer totalSeats;

    // FIX: Changed 'int' to 'Integer'. Will be set to 0 in service/constructor.
    private Integer bookedSeats = 0;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;

    private String status = "UPCOMING";
}