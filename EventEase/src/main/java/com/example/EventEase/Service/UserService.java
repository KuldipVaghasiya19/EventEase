package com.example.EventEase.Service;

import com.example.EventEase.Entity.User;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> findByEmail(String email);
}