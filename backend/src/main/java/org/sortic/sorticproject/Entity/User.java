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
    private Long id;
    private String username;
    private String password;
    private String email;
    private LocalDateTime createdAt;

    @Builder
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.createdAt = LocalDateTime.now();
    }
}

/**
 * [데이터 흐름 요약]
 * 1. 데이터 소스: 프론트엔드에서 전송된 사용자 입력 데이터
 * 2. 데이터 처리:
 *    - JPA를 통해 데이터베이스 테이블과 매핑
 *    - 각 필드의 제약조건(not null, unique 등) 검증
 * 3. 데이터 저장:
 *    - UserRepository를 통해 MySQL 데이터베이스의 users 테이블에 저장
 *    - id는 자동 증가(AUTO_INCREMENT)로 관리
 */
