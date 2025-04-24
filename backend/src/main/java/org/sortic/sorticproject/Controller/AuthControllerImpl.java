package org.sortic.sorticproject.Controller; // 이 클래스는 sorticproject의 컨트롤러 계층에 속하며, 외부 요청을 받아 처리하는 역할을 함

import org.sortic.sorticproject.Entity.Users; // Users 엔티티 클래스: 사용자 정보를 담는 VO 객체, DB 테이블과 매핑됨
import org.sortic.sorticproject.Service.UserService; // 사용자 관련 비즈니스 로직을 정의한 인터페이스 (회원가입, 아이디 중복 확인 등)
import org.sortic.sorticproject.Service.AuthService; // 인증 관련 비즈니스 로직을 정의한 인터페이스 (로그인 처리, JWT 토큰 발급/검증 등)
import org.springframework.beans.factory.annotation.Autowired; // 의존성 주입(DI)을 위해 스프링이 제공하는 어노테이션
import org.springframework.http.ResponseEntity; // HTTP 응답 데이터 및 상태 코드를 담는 객체
import org.springframework.web.bind.annotation.*; // REST API를 만들기 위한 핵심 어노테이션들 (Controller, Mapping, Request 처리 등)

import java.util.Collections; // 단일 요소만 가진 불변 Map 생성을 위한 유틸리티 클래스
import java.util.Map; // 키-값 쌍 구조의 데이터를 담기 위한 인터페이스

/**
 * 인증(회원가입/로그인/토큰 검증)과 관련된 REST API 요청을 처리하는 컨트롤러 클래스
 * 이 클래스는 AuthController 인터페이스를 구현하여 실제 기능을 정의함
 */
@RestController // 해당 클래스가 REST 컨트롤러임을 선언 (모든 반환 값은 JSON/XML로 자동 변환됨)
@RequestMapping("/api/auth") // 모든 메서드는 "/api/auth" 경로 아래에서 요청을 받음
public class AuthControllerImpl implements AuthController { // AuthController 인터페이스를 구현하여 인증 기능을 정의한 구현 클래스

    private final UserService userService; // 회원가입, 아이디 중복확인 등 사용자 관련 비즈니스 로직을 수행하는 서비스 객체
    private final AuthService authService; // 로그인 및 JWT 발급/검증 로직을 수행하는 인증 서비스 객체

    @Autowired // 생성자 기반 의존성 주입을 수행함. 스프링이 자동으로 필요한 객체를 주입함
    public AuthControllerImpl(UserService userService, AuthService authService) {
        this.userService = userService; // 주입받은 UserService를 필드에 저장
        this.authService = authService; // 주입받은 AuthService를 필드에 저장
    }

    /**
     * [회원가입 요청 처리 메서드]
     * 프론트엔드로부터 JSON 형태로 사용자 정보가 전달되며, 이를 Users 객체로 변환하여 DB에 저장 시도
     * @param user 요청 바디로 전달된 사용자 정보 (user_id, password 등 포함)
     * @return 회원가입 성공/실패 메시지를 ResponseEntity에 담아 반환
     */
    @Override
    @PostMapping("/signup") // HTTP POST 요청 중 "/api/auth/signup" 경로를 이 메서드에 매핑
    public ResponseEntity<?> signup(@RequestBody Users user) { // 요청 본문(RequestBody)의 JSON 데이터를 Users 객체로 변환하여 매개변수로 받음
        try {
            Users savedUser = userService.signup(user); // 실제 DB에 사용자를 저장하는 로직 수행
            return ResponseEntity.ok().body("회원가입이 완료되었습니다."); // 성공 시 HTTP 200 OK + 성공 메시지 반환
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 실패 시 HTTP 400 Bad Request + 예외 메시지 반환
        }
    }

    /**
     * [아이디 중복 확인 메서드]
     * 사용자가 입력한 아이디(user_id)가 이미 존재하는지 확인
     * @param user_id URL 경로에서 추출한 사용자 아이디
     * @return 중복 여부(Boolean)를 ResponseEntity에 담아 반환
     */
    @Override
    @GetMapping("/check-userid/{user_id}") // HTTP GET 요청 중 "/api/auth/check-userid/{user_id}" 형태의 요청을 처리
    public ResponseEntity<?> checkUserId(@PathVariable String user_id) { // PathVariable을 통해 URL 경로에서 user_id 값을 추출
        boolean isAvailable = userService.checkUserId(user_id); // 해당 아이디가 DB에 존재하는지 확인
        return ResponseEntity.ok().body(isAvailable); // 중복 여부(true: 사용 가능, false: 중복)를 JSON 형태로 반환
    }

    /**
     * [로그인 요청 처리 메서드]
     * 사용자로부터 받은 아이디/비밀번호를 기반으로 인증을 수행하고 JWT 토큰을 발급
     * @param user 요청 바디로 전달된 로그인 정보 (user_id, password)
     * @return 인증 성공 시 사용자 정보 + 토큰을, 실패 시 오류 메시지를 반환
     */
    @Override
    @PostMapping("/login") // HTTP POST 요청 중 "/api/auth/login" 경로를 이 메서드에 매핑
    public ResponseEntity<?> login(@RequestBody Users user) { // 로그인 요청의 JSON 데이터를 Users 객체로 매핑하여 받음
        try {
            Users authenticatedUser = authService.login(user.getUser_id(), user.getPassword()); // 아이디와 비밀번호로 인증 시도

            if (authenticatedUser != null) { // 인증 성공 시
                String token = authService.generateJwtToken(authenticatedUser); // 사용자 정보를 기반으로 JWT 토큰 생성
                return ResponseEntity.ok().body(Map.of( // 사용자 정보와 함께 토큰을 JSON 형태로 반환
                    "user_id", authenticatedUser.getUser_id(), // 사용자 아이디
                    "username", authenticatedUser.getUsername(), // 사용자 이름
                    "token", token // JWT 토큰
                ));
            } else {
                return ResponseEntity.status(401).body("아이디 또는 비밀번호가 잘못되었습니다."); // 인증 실패 시 401 Unauthorized 반환
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage()); // 예외 발생 시 동일하게 401 응답 + 예외 메시지
        }
    }

    /**
     * [JWT 토큰 유효성 검증 메서드]
     * 클라이언트로부터 전달받은 JWT 토큰의 유효 여부를 판단
     * @param token HTTP 헤더의 Authorization 필드에서 전달된 JWT 문자열
     * @return 유효하면 true, 아니면 false를 JSON 형태로 반환
     */
    @Override
    @PostMapping("/validate-token") // HTTP POST 요청 중 "/api/auth/validate-token" 경로를 이 메서드에 매핑
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) { // HTTP 요청 헤더의 Authorization 값 추출
        boolean isValid = authService.validateToken(token); // 전달된 토큰의 유효성을 검증
        return ResponseEntity.ok().body(Collections.singletonMap("isValid", isValid)); // {"isValid": true/false} 형태로 JSON 반환
    }
}
