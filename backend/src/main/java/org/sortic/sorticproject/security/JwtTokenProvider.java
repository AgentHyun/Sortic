package org.sortic.sorticproject.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

/**
 * JWT 토큰 생성 및 검증을 담당하는 컴포넌트
 */
@Component
public class JwtTokenProvider {

    /**
     * Base64로 인코딩된 비밀 키
     */
    @Value("${jwt.secret}")
    private String jwtSecret;

    /**
     * 기본 토큰 만료시간 (밀리초 단위)
     */
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Jwt 서명 키
     */
    private SecretKey signingKey;

    /**
     * Bean 생성 후 SecretKey 초기화
     */
    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 기본 만료시간(jwtExpiration) 기반 토큰 생성
     *
     * @param userId 사용자 식별자
     * @return 생성된 JWT
     */
    public String createToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(now)
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact();
    }

    /**
     * 분 단위 만료시간 기반 토큰 생성
     *
     * @param userId  사용자 식별자
     * @param minutes 만료까지 남은 분
     * @return 생성된 JWT
     */
    public String createToken(String userId, long minutes) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + minutes * 60 * 1000);

        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact();
    }

    /**
     * Authorization 헤더의 Bearer 토큰에서 사용자 ID 추출
     *
     * @param bearerToken "Bearer <token>"
     * @return 토큰에 담긴 사용자 ID
     */
    public String getUserId(String bearerToken) {
        String token = removeBearerPrefix(bearerToken);
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(signingKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }

    /**
     * JWT 토큰 유효성 검사
     *
     * @param bearerToken "Bearer <token>"
     * @throws InvalidJwtException 유효하지 않거나 만료된 토큰
     */
    public void validate(String bearerToken) {
        try {
            String token = removeBearerPrefix(bearerToken);
            Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token);
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidJwtException("Invalid JWT token", e);
        }
    }

    /**
     * "Bearer " 접두어 제거
     */
    private String removeBearerPrefix(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }
}
