package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.Users;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 관련 요청을 처리하는 컨트롤러 인터페이스
 * 회원 가입, 로그인, 토큰 검증 등의 인증 관련 기능을 정의
 */

public interface AuthController {
    /**
     * 회원가입 요청을 처리
     * @param user 회원가입 정보를 포함한 Users 객체
     * @return 회원가입 결과
     */
    @PostMapping("/signup")
    ResponseEntity<?> signup(@RequestBody Users user);

    /**
     * 사용자 아이디 중복 확인
     * @param user_id 확인할 사용자 아이디
     * @return 사용 가능 여부
     */
    @GetMapping("/check/{user_id}")
    ResponseEntity<?> checkUserId(@PathVariable String user_id);

    /**
     * 로그인 처리
     * @param user 로그인 정보를 포함한 Users 객체
     * @return 로그인 결과 (JWT 토큰 포함)
     */
    @PostMapping("/login")
    ResponseEntity<?> login(@RequestBody Users user);

    /**
     * 토큰 유효성 검사
     * @param token JWT 토큰
     * @return 토큰 유효성 검사 결과
     */
    @PostMapping("/validate")
    ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token);
}
