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
public class AuthControllerImpl implements AuthController {
    private final UserService userService;

    @Autowired
    public AuthControllerImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User savedUser = userService.signup(user);
            return ResponseEntity.ok().body("회원가입이 완료되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        boolean isAvailable = userService.checkUsername(username);
        return ResponseEntity.ok().body(isAvailable);
    }
} 