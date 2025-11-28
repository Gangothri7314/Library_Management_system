package com.example.demo.Repository;

import com.example.demo.entity.IssueRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IssueRecordRepository extends JpaRepository<IssueRecord, Long> {
    List<IssueRecord> findByMemberId(Long memberId);
    List<IssueRecord> findByBookIdAndReturnDateIsNull(Long bookId);
    List<IssueRecord> findByReturnDateIsNull();
    @Query("SELECT COUNT(ir) FROM IssueRecord ir WHERE ir.dueDate < CURRENT_DATE AND ir.returnDate IS NULL")
    long countOverdueBooks();

    @Query("SELECT SUM(ir.fine) FROM IssueRecord ir")
    Double calculateTotalFines();// currently issued
}

