package org.sortic.sorticproject.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret}")       // application.yml - jwt.secret: "32byteRandom문자열"
    private String secret;

    @Value("${jwt.expiration}")   // jwt.expiration: 86400000  (1day, ms)
    private long validityInMs;

    private SecretKey key;

    @PostConstruct
    private void init() {
        /* ⚠️ Boot 3.x 부터는 jakarta.* 패키지 사용 */
        byte[] decoded = Base64.getDecoder().decode(secret);
        key = Keys.hmacShaKeyFor(decoded);
    }

    /** 토큰 발급 */
    public String createToken(String userId) {
        Date now = new Date();
        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + validityInMs))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    /** Authorization 헤더의 Bearer 토큰 → 사용자 ID 추출 */
    public String getUserId(String bearerToken) {
        String token = bearerToken.replaceFirst("^Bearer\\s+", "");
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
            .parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    /** 토큰 유효성 검사 (만료·서명 확인) */
    public void validate(String bearerToken) {
        try {
            String token = bearerToken.replaceFirst("^Bearer\\s+", "");
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
        } catch (JwtException | IllegalArgumentException e) {
            /* 필터에서 바로 AuthenticationException 으로 감싸 throw */
            throw new InvalidJwtException("Invalid JWT token", e);
        }
    }
}
