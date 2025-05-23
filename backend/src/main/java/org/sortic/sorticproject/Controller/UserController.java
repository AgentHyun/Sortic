
package org.sortic.sorticproject.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Dto.request.SignupRequest;
import org.sortic.sorticproject.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

    import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    /**
     * ✅ 아이디 중복 확인 (비인증)
     */
    @GetMapping("/check-userid")
    public ResponseEntity<?> checkUserId(@RequestParam("userId") String userId) {
        return ResponseEntity.ok(userService.checkUserId(userId));
    }

    /**
     * ✅ 상호명 중복 확인 (비인증)
     */
    @GetMapping("/check-store")
    public ResponseEntity<?> checkStoreName(@RequestParam("storeName") String storeName) {
        return ResponseEntity.ok(userService.checkStoreName(storeName));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid SignupRequest request, BindingResult result) {
        if (result.hasErrors()) {
            System.out.println("❌ [유효성 검증 실패]");
            result.getFieldErrors().forEach(error -> {
                System.out.printf("필드: %s, 메시지: %s%n", error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body("유효성 검사 실패");
        }

        System.out.println("✅ [UserController] 회원가입 요청 도달: " + request.getUserId());
        userService.signup(request);
        return ResponseEntity.ok("회원가입 완료");
    }
//    @PostMapping("/signup")
//    public ResponseEntity<?> signup(@RequestBody @Valid SignupRequest request) {
//        System.out.println("✅ [UserController] 회원가입 요청 도달: " + request.getUserId());
//        userService.signup(request);
//        return ResponseEntity.ok("회원가입 완료");
//    }

    /**
     * ✅ 아이디 찾기 (비인증)
     */
    @PostMapping("/find-id")
    public ResponseEntity<?> findUserId(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String storeName = request.get("store_name");
            String userId = userService.findUserIdByEmailAndStoreName(email, storeName);
            return ResponseEntity.ok(Collections.singletonMap("userId", userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    /**
     * ✅ 임시 비밀번호 발급 (비인증)
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.sendTemporaryPassword(email);
            return ResponseEntity.ok(Collections.singletonMap("message", "임시 비밀번호가 이메일로 전송되었습니다."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }
}
