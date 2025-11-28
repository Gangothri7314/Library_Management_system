package com.example.demo.controller;

import com.example.demo.entity.Member;
import com.example.demo.Repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping
    public List<Member> getAll() {
        return memberRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getOne(@PathVariable Long id) {
        Optional<Member> opt = memberRepository.findById(id);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Member> create(@RequestBody Member member) {
        if (member.getJoinDate() == null) member.setJoinDate(LocalDate.now());
        Member saved = memberRepository.save(member);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> update(@PathVariable Long id, @RequestBody Member payload) {
        Optional<Member> opt = memberRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Member m = opt.get();
        m.setName(payload.getName());
        m.setEmail(payload.getEmail());
        m.setContact(payload.getContact());
        m.setPlanType(payload.getPlanType());
        m.setFees(payload.getFees());
        m.setExpiryDate(payload.getExpiryDate());
        memberRepository.save(m);
        return ResponseEntity.ok(m);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!memberRepository.existsById(id)) return ResponseEntity.notFound().build();
        memberRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
