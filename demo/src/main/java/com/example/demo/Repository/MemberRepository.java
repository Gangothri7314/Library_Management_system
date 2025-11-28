package com.example.demo.Repository;

import com.example.demo.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // Optional extra query if you ever need to find by email
    Optional<Member> findByEmail(String email);
}

