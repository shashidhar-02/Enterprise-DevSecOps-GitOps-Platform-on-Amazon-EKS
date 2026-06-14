package com.company.auth.service;

import com.company.auth.dto.AuthResponse;
import com.company.auth.dto.LoginRequest;
import com.company.auth.dto.RegisterRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JwtService jwtService;

    public AuthService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        // Implement database authentication
        return AuthResponse.builder()
                .token("mock-token")
                .email(request.getEmail())
                .role("USER")
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        // Implement database user creation
        return AuthResponse.builder()
                .token("mock-token")
                .email(request.getEmail())
                .role(request.getRole())
                .build();
    }
}
