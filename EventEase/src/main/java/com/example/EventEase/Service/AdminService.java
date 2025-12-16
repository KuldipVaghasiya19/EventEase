package com.example.EventEase.Service;

import com.example.EventEase.Entity.Admin;
import java.util.Optional;

public interface AdminService {
    Admin createAdmin(Admin admin);
    Optional<Admin> findByEmail(String email);
}