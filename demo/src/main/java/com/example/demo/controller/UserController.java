package com.example.demo.controller;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService){ this.userService = userService; }

    @GetMapping("/borrow-status")
    public List<Map<String,Object>> borrowStatus(){ return userService.getBorrowStatus(); }
}
