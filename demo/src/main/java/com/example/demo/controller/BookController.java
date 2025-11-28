package com.example.demo.controller;

import com.example.demo.entity.Book;
import com.example.demo.Repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)

public class BookController {

    @Autowired private BookRepository bookRepository;

    @GetMapping
    public List<Book> getAll() { return bookRepository.findAll(); }

    @GetMapping("/search")
    public List<Book> search(@RequestParam(required = false) String title,
                             @RequestParam(required = false) String author,
                             @RequestParam(required = false) String category,
                             @RequestParam(required = false) Boolean available) {
        if (title != null && !title.isBlank()) return bookRepository.findByTitleContainingIgnoreCase(title);
        if (author != null && !author.isBlank()) return bookRepository.findByAuthorContainingIgnoreCase(author);
        if (category != null && !category.isBlank()) return bookRepository.findByCategoryContainingIgnoreCase(category);
        if (available != null) return bookRepository.findByAvailable(available);
        return bookRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<Book> add(@RequestBody Book book) {
        if (book.isAvailable() == false) {
            book.setAvailable(true);
        }

        Book saved = bookRepository.save(book);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id, @RequestBody Book payload) {
        Optional<Book> opt = bookRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Book b = opt.get();
        b.setTitle(payload.getTitle());
        b.setAuthor(payload.getAuthor());
        b.setCategory(payload.getCategory());
        b.setPublisher(payload.getPublisher());
        b.setAvailable(payload.isAvailable());
        bookRepository.save(b);
        return ResponseEntity.ok(b);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) return ResponseEntity.notFound().build();
        bookRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
