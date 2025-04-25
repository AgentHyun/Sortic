package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.Users;
import org.springframework.http.ResponseEntity;

/**
 * 인증 관련 비즈니스 로직을 정의하는 서비스 인터페이스
 * 로그인, 토큰 검증 등의 인증 관련 기능을 제공
 */
public interface AuthService {
    /**
     * JWT 토큰 생성
     * @param user 사용자 정보
     * @return 생성된 JWT 토큰
     */
    String generateJwtToken(Users user);

    /**
     * 토큰 유효성 검사
     * @param token JWT 토큰
     * @return 토큰 유효성 검사 결과
     */
    ResponseEntity<?> validateToken(String token);

    /**
     * 로그아웃 처리
     * @param user_id 사용자 아이디
     */
    void logout(String user_id);

    /**
     * 토큰에서 사용자 ID 추출
     * @param token JWT 토큰
     * @return 사용자 ID
     */
    String getUserIdFromToken(String token);

    /**
     * 회원가입 처리
     * @param user 회원가입 정보
     * @return 회원가입 결과
     */
    ResponseEntity<?> signup(Users user);

    /**
     * 사용자 아이디 중복 확인
     * @param user_id 확인할 사용자 아이디
     * @return 사용 가능 여부
     */
    ResponseEntity<?> checkUserId(String user_id);

    /**
     * 로그인 처리
     * @param user 로그인 정보
     * @return 로그인 결과 (토큰 포함)
     */
    ResponseEntity<?> login(Users user);
} 