package com.example.demo.service;
import com.example.demo.entity.Book;
import com.example.demo.Repository.BookRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookService {
    private final BookRepository repo;
    public BookService(BookRepository repo){ this.repo = repo; }

    public List<Book> getAll() { return repo.findAll(); }
    public Book save(Book b) { return repo.save(b); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Book> search(String q) { return repo.findByTitleContainingIgnoreCase(q); }
}

