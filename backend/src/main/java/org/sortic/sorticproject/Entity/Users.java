package org.sortic.sorticproject.Entity;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.sql.Timestamp;

/**
 * 사용자 정보를 담는 엔티티 클래스
 * Users 테이블과 매핑됩니다.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {
    private String userId;                   // 아이디(기본키)
    private String password;                // 비밀번호
    private String username;                // 닉네임
    private String phone;                   // 전화번호
    private String wholesaler_code;         // 도매 코드
    private String email;                   // 이메일
    private String region;                  // 거주지역
    private String profile_image;           // 프로필 이미지 URL
    private int grade;                      // 구독 등급
    private Timestamp created_signup_time;  // 회원가입 시간
    private Boolean isCloned;               // ✅ 복제 여부 (추가됨)
}
