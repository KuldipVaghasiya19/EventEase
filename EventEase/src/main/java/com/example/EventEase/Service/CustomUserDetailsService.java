package com.example.EventEase.Service;

import com.example.EventEase.Entity.Admin;
import com.example.EventEase.Entity.User;
import com.example.EventEase.Repository.AdminRepository;
import com.example.EventEase.Repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public CustomUserDetailsService(AdminRepository adminRepository,
                                    UserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        System.out.println("Entered in cus.");
        List<GrantedAuthority> authorities = new ArrayList<>();

        // 1. Try to find an Admin (ROLE_ADMIN)
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            Admin adm = admin.get();
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            return new org.springframework.security.core.userdetails.User(adm.getEmail(), adm.getPassword(), authorities);
        }

        // 2. If no Admin is found, try to find a standard User (ROLE_USER)
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User usr = user.get();
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            return new org.springframework.security.core.userdetails.User(usr.getEmail(), usr.getPassword(), authorities);
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}