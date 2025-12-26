package com.example.EventEase.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "booking_seq2")
    @SequenceGenerator(name = "booking_seq2", sequenceName = "event_id_seq", initialValue = 16205, allocationSize = 6)
    private Long id;

    @NonNull
    private String name;

    private String about;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_tags", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "tag_name")
    private Set<String> tags;


    private String organizationName;

    @NonNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime date;

    @NonNull
    private String venue;

    @NonNull
    private Integer totalSeats;

    private Integer bookedSeats = 0;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Booking> bookings;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    @JsonIgnoreProperties("createdEvents")
    private Admin admin;

    private String status = "UPCOMING";
}