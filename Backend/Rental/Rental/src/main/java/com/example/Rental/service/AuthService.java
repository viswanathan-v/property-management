package com.example.Rental.service;

import com.example.Rental.model.User;
import com.example.Rental.repository.UserRepo;
import com.example.Rental.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public String registerUser(User user) {
        if (userRepo.existsByUsername(user.getUsername())) {
            return "Username is already taken!";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return "User registered successfully!";
    }

    public Map<String, Object> authenticateUser(String username, String password) {
        Optional<User> user = userRepo.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            String role = user.get().getRole(); // assuming role is stored
            String token = jwtUtils.generateToken(username,role);

            response.put("token", token);
            response.put("role", role);
            return response;
        }

        response.put("error", "Invalid username or password!");
        return response;
    }
}
