package com.example.demo.controller;

import com.example.demo.Repository.BookRepository;
import com.example.demo.Repository.IssueRecordRepository;
import com.example.demo.entity.Book;
import com.example.demo.entity.IssueRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("api/borrow")
@CrossOrigin(origins = "*")


public class BorrowController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private IssueRecordRepository issueRecordRepository;

    @PostMapping("/{memberId}/{bookId}")
    public ResponseEntity<?> borrowBook(@PathVariable Long memberId,
                                        @PathVariable Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!book.isAvailable()) {
            return ResponseEntity.badRequest().body("Book already borrowed");
        }

        IssueRecord record = new IssueRecord();
        record.setMemberId(memberId);
        record.setBookId(bookId);
        record.setBookTitle(book.getTitle());
        record.setIssueDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14));
        record.setFine(0.0);

        issueRecordRepository.save(record);

        book.setAvailable(false);
        bookRepository.save(book);

        return ResponseEntity.ok("Book Borrowed Successfully");
    }

    @GetMapping("/list/{memberId}")
    public ResponseEntity<?> getBorrowedBooks(@PathVariable Long memberId) {
        return ResponseEntity.ok(issueRecordRepository.findByMemberId(memberId));
    }

}
