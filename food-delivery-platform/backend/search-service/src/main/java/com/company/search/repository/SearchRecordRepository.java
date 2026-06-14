package com.company.search.repository;
import com.company.search.model.SearchRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

/**
 * Repository interface for SearchRecord.
 * Demonstrates Reusability and Modularity.
 */
@Repository
public interface SearchRecordRepository extends JpaRepository<SearchRecord, UUID> {
}
