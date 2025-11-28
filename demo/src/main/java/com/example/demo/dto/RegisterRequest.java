package com.example.demo.dto;

import com.example.demo.entity.RoleType;
import jakarta.validation.constraints.*;
import lombok.*;
@Getter @Setter
public class RegisterRequest {
    @Email
    @NotBlank
    private String name;
    private String email;
    private String password;
    private String role;



    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return name; }
    public void setRole(String name) { this.name = name; }
}
