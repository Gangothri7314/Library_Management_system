package com.example.demo.controller;

import com.example.demo.entity.Book;
import com.example.demo.entity.IssueRecord;
import com.example.demo.entity.Member;
import com.example.demo.Repository.BookRepository;
import com.example.demo.Repository.IssueRecordRepository;
import com.example.demo.Repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:3000")
public class IssueController {

    @Autowired
    private IssueRecordRepository issueRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private MemberRepository memberRepo;

    private static final double FINE_PER_DAY = 5.0;

    // ✅ Issue a new book to a member
    @PostMapping("/issue")
    public ResponseEntity<?> issueBook(
            @RequestParam Long memberId,
            @RequestParam Long bookId,
            @RequestParam(required = false) Integer days
    ) {
        Optional<Member> mOpt = memberRepo.findById(memberId);
        Optional<Book> bOpt = bookRepo.findById(bookId);

        if (mOpt.isEmpty() || bOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid member or book id");
        }

        Book book = bOpt.get();

        if (!book.isAvailable()) {
            return ResponseEntity.badRequest().body("Book not available");
        }

        // Create new issue record
        IssueRecord record = new IssueRecord();
        record.setMemberId(memberId);
        record.setMemberName(mOpt.get().getName());
        record.setBookId(bookId);
        record.setBookTitle(book.getTitle());
        record.setIssueDate(LocalDate.now());

        int loanDays = (days == null ? 14 : days);
        record.setDueDate(LocalDate.now().plusDays(loanDays));
        record.setFine(0.0);

        issueRepo.save(record);

        // Mark book as borrowed
        book.setAvailable(false);
        bookRepo.save(book);

        return ResponseEntity.ok("Book issued successfully until " + record.getDueDate());
    }

    // ✅ Return a borrowed book
    @PostMapping("/return")
    public ResponseEntity<?> returnBook(@RequestParam Long issueId) {
        Optional<IssueRecord> opt = issueRepo.findById(issueId);
        if (opt.isEmpty()) return ResponseEntity.badRequest().body("Invalid issue id");

        IssueRecord record = opt.get();

        if (record.getReturnDate() != null) {
            return ResponseEntity.badRequest().body("Book already returned");
        }

        LocalDate now = LocalDate.now();
        record.setReturnDate(now);

        // Calculate fine
        double fine = 0.0;
        if (record.getDueDate() != null && now.isAfter(record.getDueDate())) {
            long daysLate = ChronoUnit.DAYS.between(record.getDueDate(), now);
            fine = daysLate * FINE_PER_DAY;
        }

        record.setFine(fine);
        issueRepo.save(record);

        // Update book availability
        Optional<Book> bookOpt = bookRepo.findById(record.getBookId());
        bookOpt.ifPresent(b -> {
            b.setAvailable(true);
            bookRepo.save(b);
        });

        return ResponseEntity.ok("Book returned successfully. Fine: ₹" + fine);
    }

    // ✅ Member borrowing history
    @GetMapping("/history/{memberId}")
    public ResponseEntity<List<IssueRecord>> history(@PathVariable Long memberId) {
        return ResponseEntity.ok(issueRepo.findByMemberId(memberId));
    }

    // ✅ Currently issued books (not yet returned)
    @GetMapping("/issued")
    public ResponseEntity<List<IssueRecord>> currentlyIssued() {
        return ResponseEntity.ok(issueRepo.findByReturnDateIsNull());
    }
}
