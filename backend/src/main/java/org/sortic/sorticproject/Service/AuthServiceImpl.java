package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import java.util.Date;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    private SecretKey getSigningKey() {
        // Base64로 인코딩된 키를 디코딩
        byte[] decodedKey = Base64.getDecoder().decode(jwtSecret);
        return Keys.hmacShaKeyFor(decodedKey);
    }

    @Override
    public ResponseEntity<?> login(Users user) {
        try {
            Users foundUser = userMapper.findByUserId(user.getUserId());
            if (foundUser == null) {
                return ResponseEntity.badRequest().body("존재하지 않는 아이디입니다.");
            }
            if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.badRequest().body("비밀번호가 일치하지 않습니다.");
            }
            
            String token = generateJwtToken(foundUser);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", foundUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Override
    public String generateJwtToken(Users user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(user.getUserId())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public ResponseEntity<?> validateToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid token format");
        }
        
        try {
            token = token.substring(7);
            
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return ResponseEntity.ok().body(true);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token: " + e.getMessage());
        }
    }

    @Override
    public void logout(String user_id) {
        // 현재는 클라이언트 측에서 토큰을 삭제하는 방식으로 처리
        // 필요한 경우 토큰 블랙리스트 구현 가능
    }

    @Override
    public String getUserIdFromToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token format");
        }
        
        token = token.substring(7);
        
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    @Override
    public ResponseEntity<?> signup(Users user) {
        try {
            // 아이디 중복 확인
            if (userMapper.findByUserId(user.getUserId()) != null) {
                return ResponseEntity.badRequest().body("이미 존재하는 아이디입니다.");
            }
            
            // 비밀번호 암호화
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // 사용자 저장
            userMapper.insertUser(user);
            
            return ResponseEntity.ok().body("회원가입이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> checkUserId(String user_id) {
        try {
            boolean exists = userMapper.findByUserId(user_id) != null;
            return ResponseEntity.ok().body(!exists);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
 