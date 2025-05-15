package org.sortic.sorticproject.Controller;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.sortic.sorticproject.security.token.JwtTokenProvider;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /** ✅ 아이디 중복 확인 (비인증) */
    @GetMapping("/check-userid")
    public ResponseEntity<?> checkUserId(@RequestParam("userId") String userId) {
        boolean available = userService.checkUserId(userId);
        return ResponseEntity.ok(available);
    }

    /** ✅ 상호명 중복 확인 (비인증) */
    @GetMapping("/check-store")
    public ResponseEntity<?> checkStoreName(@RequestParam("storeName") String storeName) {
        boolean available = userService.checkStoreName(storeName);
        return ResponseEntity.ok(available);
    }

    /** ✅ 회원가입 시 상호 이미지 업로드 (비인증) */
    @PostMapping("/store-image")
    public ResponseEntity<?> uploadStoreImage(
        @RequestHeader("Authorization") String token,
        @RequestParam("image") MultipartFile file) {
        try {
            String userId = jwtTokenProvider.getUserId(token);
            String imageUrl = userService.uploadStoreImage(userId, file);
            return ResponseEntity.ok(Collections.singletonMap("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    /** ✅ 회원가입 시 주소 등록 (비인증) */
    @PostMapping("/register-address")
    public ResponseEntity<?> registerSignupAddress(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String zipcode = request.get("zipcode");
            String roadAddress = request.get("roadAddress");
            String detailAddress = request.get("detailAddress");
            userService.saveUserAddress(userId, zipcode, roadAddress, detailAddress);
            return ResponseEntity.ok(Collections.singletonMap("message", "주소가 등록되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "주소 등록에 실패했습니다."));
        }
    }

    /** ✅ 아이디 찾기 (비인증) */
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

    /** ✅ 임시 비밀번호 발급 (비인증) */
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
