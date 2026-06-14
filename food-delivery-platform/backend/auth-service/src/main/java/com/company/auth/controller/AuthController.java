package com.company.auth.controller;

import com.company.auth.dto.AuthResponse;
import com.company.auth.dto.LoginRequest;
import com.company.auth.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Placeholder for login logic
        return ResponseEntity.ok(AuthResponse.builder()
                .token("sample-jwt-token")
                .email(request.getEmail())
                .role("USER")
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Placeholder for register logic
        return ResponseEntity.ok(AuthResponse.builder()
                .token("sample-jwt-token")
                .email(request.getEmail())
                .role(request.getRole())
                .build());
    }
}
