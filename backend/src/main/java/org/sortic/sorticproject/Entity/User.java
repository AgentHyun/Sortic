package org.sortic.sorticproject.Entity;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * 사용자 정보를 담는 엔티티 클래스
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private String userId;        // 아이디(기본키)
    private String password;      // 비밀번호
    private String username;      // 닉네임
    private String phone;         // 전화번호
    private String email;         // 이메일
    private String region;        // 거주지역
    private Integer grade;        // 구독 등급
    private LocalDateTime createdSignupTime;  // 회원가입 시간

    @Builder
    public User(String userId, String password, String username, String phone, String email, String region) {
        this.userId = userId;
        this.password = password;
        this.username = username;
        this.phone = phone;
        this.email = email;
        this.region = region;
        this.grade = 0;  // 기본 구독 등급은 0
        this.createdSignupTime = LocalDateTime.now();
    }
}

/**
 * [데이터 흐름 요약]
 * 1. 데이터 소스: 프론트엔드에서 전송된 사용자 입력 데이터
 * 2. 데이터 처리:
 *    - MyBatis를 통해 데이터베이스 테이블과 매핑
 *    - 각 필드의 제약조건(not null 등) 검증
 * 3. 데이터 저장:
 *    - UserMapper를 통해 MySQL 데이터베이스의 User 테이블에 저장
 *    - userId는 사용자가 입력한 값으로 관리
 */
