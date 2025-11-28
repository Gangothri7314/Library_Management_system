package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetLink(String email, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
    public void sendEmail(String to, String subject, String text) {
    try {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("gangothri1910@gmail.com"); // ✅ your mail here
        mailSender.send(message);
        System.out.println("✅ Email sent successfully to: " + to);
    } catch (Exception e) {
        System.err.println("❌ Failed to send email: " + e.getMessage());
        e.printStackTrace();
        throw new RuntimeException("Error while sending email", e);
    }
    }



}
