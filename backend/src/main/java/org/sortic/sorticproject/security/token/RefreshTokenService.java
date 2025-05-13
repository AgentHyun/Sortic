package org.sortic.sorticproject.security.token;

/**
 * 리프레시 토큰 저장/조회/삭제 기능 인터페이스
 */
public interface RefreshTokenService {
    void save(String userId, String token, long expiry);
    String find(String userId);
    void delete(String userId);
}
