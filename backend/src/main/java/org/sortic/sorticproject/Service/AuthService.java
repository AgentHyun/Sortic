package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.Users;

/**
 * 인증 관련 비즈니스 로직을 정의하는 서비스 인터페이스
 * 로그인, 토큰 검증 등의 인증 관련 기능을 제공
 */
public interface AuthService {
    /**
     * 사용자 로그인 처리
     * @param user_id 사용자 아이디
     * @param password 비밀번호
     * @return 인증된 사용자 정보
     */
    Users login(String user_id, String password);

    /**
     * JWT 토큰 생성
     * @param user 사용자 정보
     * @return 생성된 JWT 토큰
     */
    String generateJwtToken(Users user);

    /**
     * JWT 토큰 검증
     * @param token JWT 토큰
     * @return 토큰 유효성 여부
     */
    boolean validateToken(String token);

    /**
     * 로그아웃 처리
     * @param user_id 사용자 아이디
     */
    void logout(String user_id);

    /**
     * JWT 토큰에서 사용자 아이디 추출
     * @param token JWT 토큰
     * @return 추출된 사용자 아이디
     */
    String getUserIdFromToken(String token);
} 