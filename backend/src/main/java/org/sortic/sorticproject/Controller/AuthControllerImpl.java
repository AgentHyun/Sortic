package org.sortic.sorticproject.Controller; // 이 클래스는 sorticproject의 컨트롤러 계층에 속하며, 외부 요청을 받아 처리하는 역할을 함

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.Users; // Users 엔티티 클래스: 사용자 정보를 담는 VO 객체, DB 테이블과 매핑됨
import org.sortic.sorticproject.Mapper.UserMapper;
import org.sortic.sorticproject.Service.AuthService; // 인증 관련 비즈니스 로직을 정의한 인터페이스 (로그인 처리, JWT 토큰 발급/검증 등)
import org.sortic.sorticproject.security.InvalidJwtException;
import org.sortic.sorticproject.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // HTTP 응답 데이터 및 상태 코드를 담는 객체
import org.springframework.web.bind.annotation.*; // REST API를 만들기 위한 핵심 어노테이션들 (Controller, Mapping, Request 처리 등)

import java.util.Map;

/**
 * [인증 관련 API 컨트롤러]
 * - 회원가입, 로그인, 아이디 중복 체크를 처리
 * - 비즈니스 로직은 AuthService 에 위임
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthControllerImpl implements AuthController {

    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    /** 회원가입 */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Users user) {
        return authService.signup(user);
    }

    /** 아이디 중복 확인 */
    @GetMapping("/check-userid")
    public ResponseEntity<?> checkUserId(@RequestParam("user_id") String userId) {
        return authService.checkUserId(userId);
    }

    /** 로그인 처리 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        return authService.login(user);
    }

    // ✅ /validate-token 은 보안 필터 체인 방식에서 제거됨
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰 누락");
        }

        String token = authHeader.substring(7); // "Bearer " 제거
        try {
            jwtTokenProvider.validate(token); // 유효성 검사
            String userId = jwtTokenProvider.getUserId(token);
            Users user = userMapper.findByUserId(userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 없음");
            }

            return ResponseEntity.ok(Map.of("user", user));
        } catch (InvalidJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰 무효");
        }
    }
}
