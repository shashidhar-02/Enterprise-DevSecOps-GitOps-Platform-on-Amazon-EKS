package com.company.user.service;
import com.company.user.model.User;
import com.company.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Service class for User business logic.
 * Demonstrates Reliability, Scalability, and Maintainability.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;

    @Transactional(readOnly = true)
    public List<User> findAll() {
        log.info("Fetching all {}s", "User");
        return repository.findAll();
    }

    @Transactional
    public User save(User entity) {
        log.info("Saving new {} with name: {}", "User", entity.getName());
        return repository.save(entity);
    }
}
