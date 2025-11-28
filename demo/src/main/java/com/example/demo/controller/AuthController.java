package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.PasswordResetToken;
import com.example.demo.entity.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.JwtService;
import com.example.demo.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)

public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetService passwordResetService;
    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;


    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final List<String> ALLOWED_ROLES = Arrays.asList("ADMIN", "LIBRARIAN", "MEMBER");
    private Map<String, String> otpStore = new HashMap<>();

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email not found"));
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, otp);

        emailService.sendEmail(email, "Password Reset OTP",
                "Your OTP for password reset is: " + otp + "\nIt will expire in 10 minutes.");

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (otpStore.containsKey(email) && otpStore.get(email).equals(otp)) {
            otpStore.remove(email); // clear after success
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP"));
    }
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ✅ Example resetPassword endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token and new password required");
        }

        Optional<PasswordResetToken> opt = passwordResetService.validateToken(token);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        PasswordResetToken resetToken = opt.get();
        User user = resetToken.getUser();
        user.setPassword(newPassword); // Hash it if using BCrypt
        userRepository.save(user);

        passwordResetService.removeToken(token);
        return ResponseEntity.ok("Password reset successfully!");
    }
    // ✅ REGISTER endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        String inputRole = request.getRole();

        // Handle nulls and case-insensitive match
        if (inputRole == null ||
                !(inputRole.equalsIgnoreCase("ADMIN") ||
                        inputRole.equalsIgnoreCase("LIBRARIAN") ||
                        inputRole.equalsIgnoreCase("USER"))) {
            return ResponseEntity.badRequest().body("Invalid role selected");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(inputRole.toUpperCase()); // ✅ normalize to uppercase
        user.setActive(true);

        userRepository.save(user);
        return ResponseEntity.ok("Registration successful!");
    }

    // ✅ LOGIN endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        // 1️⃣ Find user by email
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        User user = optionalUser.get();

        // 2️⃣ Verify password using encoder
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        // 3️⃣ Check if account is active
        if (!user.getActive()) {
            return ResponseEntity.badRequest().body("Account is not active");
        }

        // 4️⃣ Generate JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        // 5️⃣ Return response with token and role
        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole(),
                "name", user.getName()
        ));
    }


    // ✅ FORGOT PASSWORD endpoint (fixed)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                // Don’t reveal whether the email exists — better for security
                return ResponseEntity.ok("If that email exists, a reset link was sent.");
            }

            // ✅ Create reset token for user
            PasswordResetToken token = passwordResetService.createTokenForEmail(email, 15);
            if (token == null) {
                return ResponseEntity.status(500).body("Could not create token");
            }

            // ✅ Build frontend reset-password link
            String resetLink = "http://localhost:3000/reset-password?token=" + token.getToken();

            // ✅ Email content
            String subject = "Password Reset Request - Librario";
            String text = "Hello " + userOpt.get().getName() + ",\n\n"
                    + "You requested to reset your password for your Librario account.\n"
                    + "Click the link below to reset it:\n\n"
                    + resetLink + "\n\n"
                    + "⚠️ This link will expire in 15 minutes.\n\n"
                    + "If you didn't request a password reset, you can safely ignore this email.\n\n"
                    + "Regards,\nLibrario Support Team";

            // ✅ Send email with the reset link
            emailService.sendEmail(email, subject, text);

            return ResponseEntity.ok("Password reset link sent to " + email);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send reset link: " + e.getMessage());
        }
    }

    // Step 2 - verify token
    @GetMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestParam("token") String token) {
        // ✅ Call via instance
        Optional<PasswordResetToken> opt = passwordResetService.validateToken(token);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
        return ResponseEntity.ok("Token valid");
    }
    // Step 3 - reset password

}
