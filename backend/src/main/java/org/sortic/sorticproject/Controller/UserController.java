package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Service.UserService;
import org.sortic.sorticproject.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    // 프로필 정보 조회
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam("userId") String userId) {
        try {
            Users user = userService.findByUserId(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 프로필 이미지 업로드
    @PostMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("userId") String userId,
            @RequestParam("image") MultipartFile file) {
        try {
            String imageUrl = userService.uploadProfileImage(userId, file);
            return ResponseEntity.ok().body(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 기본 프로필 이미지로 설정
    @PostMapping("/profile-image/default")
    public ResponseEntity<?> setDefaultProfileImage(@RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserIdFromToken(token);
            userService.setDefaultProfileImage(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 프로필 정보 업데이트
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam("userId") String userId,
            @RequestBody Users user) {
        try {
            user.setUserId(userId);
            userService.updateUserProfile(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 토큰에서 사용자 ID 추출 (임시 구현)
    private String extractUserIdFromToken(String token) {
        // 실제 구현에서는 JWT 토큰 파싱 필요
        return token.replace("Bearer", "");
    }

    @PostMapping("/find-id")
    public ResponseEntity<?> findUserId(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String username = request.get("username");
            String userId = userService.findUserIdByEmailAndUsername(email, username);
            return ResponseEntity.ok(Collections.singletonMap("userId", userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.sendTemporaryPassword(email);
            return ResponseEntity.ok(Collections.singletonMap("message", "임시 비밀번호가 이메일로 전송되었습니다."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            userService.changePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok(Collections.singletonMap("message", "비밀번호가 성공적으로 변경되었습니다."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            authService.logout(userId);
            return ResponseEntity.ok(Collections.singletonMap("message", "로그아웃되었습니다."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("message", e.getMessage()));
        }
    }



}
