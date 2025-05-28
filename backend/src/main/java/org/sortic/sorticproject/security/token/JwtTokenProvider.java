package org.sortic.sorticproject.security.token;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.sortic.sorticproject.security.InvalidJwtException;
import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration; // 밀리초 단위

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /** 분 단위 만료시간 설정 */
    public String createToken(String userId, long minutes) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + minutes * 60 * 1000);  // Access Token 만료시간 (로그아웃) .setIssuedAt(now) ".setExpiration(expiry)" 추가시 만료시간 생성 / 삭제시 만료시간 없음
        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(now)
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact();
    }

    /** 토큰에서 사용자 ID 추출 */
    public String getUserId(String bearerToken) {
        String token = removeBearerPrefix(bearerToken);
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(signingKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }

    /** 토큰 검증 */
    public void validate(String bearerToken) {
        try {
            String token = removeBearerPrefix(bearerToken);
            log.info("✅ 유효성 검사 시작: {}", token); // ⬅️ 추가
            Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token);
            log.info("✅ 유효성 검사 통과"); // ⬅️ 추가
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidJwtException("유효하지 않은 JWT 토큰입니다.", e);
        }
    }

    /** Bearer 접두어 제거 */
    private String removeBearerPrefix(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }

    /** Refresh 토큰 만료 시간 반환 (DB 저장용) */
    public long getRefreshTokenExpiry() {
        return System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7; // 7일
    }
}
