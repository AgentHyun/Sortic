package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.User;
import org.sortic.sorticproject.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 관련 요청을 처리하는 컨트롤러
 */
@RestController
@RequestMapping("/api/auth")
public class AuthControllerImpl implements AuthController {
    private final UserService userService;

    @Autowired
    public AuthControllerImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User savedUser = userService.signup(user);
            return ResponseEntity.ok().body("회원가입이 완료되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Override
    @GetMapping("/check-userid/{userId}")
    public ResponseEntity<?> checkUserId(@PathVariable String userId) {
        boolean isAvailable = userService.checkUserId(userId);
        return ResponseEntity.ok().body(isAvailable);
    }

    @Override
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User authenticatedUser = userService.login(user.getUserId(), user.getPassword());
            if (authenticatedUser != null) {
                // 실제 프로덕션에서는 JWT 토큰을 생성하여 반환해야 합니다
                return ResponseEntity.ok().body(
                    new LoginResponse(authenticatedUser.getUserId(), "dummy-token-for-now")
                );
            } else {
                return ResponseEntity.status(401).body("아이디 또는 비밀번호가 잘못되었습니다.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    private static class LoginResponse {
        private String userId;
        private String token;

        public LoginResponse(String userId, String token) {
            this.userId = userId;
            this.token = token;
        }

        public String getUserId() {
            return userId;
        }

        public String getToken() {
            return token;
        }
    }
} 