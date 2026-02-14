package com.example.demo.service;
import com.example.demo.Repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }

    // Example borrow-status: in real app join IssueRecord + Book + User
    public List<Map<String,Object>> getBorrowStatus(){
        // mock single entry to demo
        Map<String,Object> m = new HashMap<>();
        m.put("name","Gangothri");
        m.put("bookTitle","Java Basics");
        m.put("status","BORROWED");
        m.put("fine",0);
        return List.of(m);
    }
}

