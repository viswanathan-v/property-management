package com.example.Rental.controller;

import com.example.Rental.model.User;
import com.example.Rental.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> result = authService.authenticateUser(
                credentials.get("username"), credentials.get("password"));

        if (result.containsKey("error")) {
            return ResponseEntity.badRequest().body(result.get("error"));
        }

        return ResponseEntity.ok(result);
    }
}
