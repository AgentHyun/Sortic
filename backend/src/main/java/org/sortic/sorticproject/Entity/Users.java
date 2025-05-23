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
 *
 * [데이터 흐름 요약]
 * 1. 데이터 소스: 프론트엔드에서 전송된 사용자 입력 데이터
 * 2. 데이터 처리:
 *    - MyBatis를 통해 데이터베이스 테이블과 매핑
 *    - 각 필드의 제약조건(not null 등) 검증
 * 3. 데이터 저장:
 *    - UserMapper를 통해 MySQL 데이터베이스의 Users 테이블에 저장
 *    - user_id는 사용자가 입력한 값으로 관리
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {
    private String userId;                  // 아이디(기본키)
    private String password;                // 암호화된 비밀번호 (BCrypt)
    private String storeName;              // 닉네임
    private String email;                   // 이메일
    private String phone;                   // 전화번호
    private int grade;                     // 구독 등급
    private String region;                  // 거주지역
    private String profileImage;           // 프로필 이미지 URL
    private Timestamp created_signup_time;  // 회원가입 시간
    private String wholesalerCode;  // 회원가입 시간
    private Boolean isCloned;               // ✅ 복제 여부 (추가됨)
}
