package com.example.demo.dto;
import lombok.*;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private Set<String> roles;
}
