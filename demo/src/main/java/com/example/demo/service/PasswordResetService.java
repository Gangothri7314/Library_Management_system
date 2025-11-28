package com.example.demo.service;

import com.example.demo.entity.PasswordResetToken;
import com.example.demo.entity.User;
import com.example.demo.Repository.PasswordResetTokenRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Removed static
    public PasswordResetToken createTokenForEmail(String email, int minutesToExpire) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return null;

        User user = userOpt.get();
        String token = UUID.randomUUID().toString(); // use 6-digit OTP if you want numeric OTP
        Instant expiry = Instant.now().plus(minutesToExpire, ChronoUnit.MINUTES);

        PasswordResetToken prt = new PasswordResetToken(token, expiry, user);
        return tokenRepository.save(prt);
    }

    public Optional<PasswordResetToken> validateToken(String token) {
        Optional<PasswordResetToken> opt = tokenRepository.findByToken(token);
        if (opt.isEmpty()) return Optional.empty();

        PasswordResetToken prt = opt.get();
        if (Instant.now().isAfter(prt.getExpiryDate())) {
            tokenRepository.delete(prt);
            return Optional.empty();
        }
        return Optional.of(prt);
    }

    // ✅ Removed static
    public void removeToken(String token) {
        tokenRepository.deleteByToken(token);
    }
}
