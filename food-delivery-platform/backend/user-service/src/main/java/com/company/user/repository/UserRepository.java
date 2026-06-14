package com.company.user.repository;
import com.company.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Repository interface for User.
 * Demonstrates Reusability and Modularity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
}
