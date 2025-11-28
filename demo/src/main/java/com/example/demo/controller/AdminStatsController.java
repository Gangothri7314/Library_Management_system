package com.example.demo.controller;

import com.example.demo.Repository.BookRepository;
import com.example.demo.Repository.IssueRecordRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)

public class AdminStatsController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private IssueRecordRepository issueRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {

        Map<String, Object> stats = new HashMap<>();

        // Count Books
        long totalBooks = bookRepository.count();
        long availableBooks = bookRepository.countByAvailable(true);
        long borrowedBooks = bookRepository.countByAvailable(false);

        // Count Users
        long totalUsers = userRepository.count();

        // Overdue books
        long overdueBooks = issueRecordRepository.countOverdueBooks();

        // Fines
        Double totalFines = issueRecordRepository.calculateTotalFines();
        if (totalFines == null) totalFines = 0.0;

        stats.put("totalBooks", totalBooks);
        stats.put("availableBooks", availableBooks);
        stats.put("borrowedBooks", borrowedBooks);
        stats.put("overdueBooks", overdueBooks);
        stats.put("totalUsers", totalUsers);
        stats.put("totalFine", totalFines);

        return stats;
    }
}
