package org.sortic.sorticproject.Controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Dto.request.ProfileUpdateRequest;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * ✅ 사용자 프로필 조회 - 토큰 기반 유저 정보 반환
     */
    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        Users user = profileService.getUserProfile(token);
        return ResponseEntity.ok(user);
    }

    /**
     * ✅ 프로필 정보 수정 (비밀번호, 이메일, 연락처, 상호명 등)
     */
    @PutMapping("/save")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token,
                                           @RequestBody ProfileUpdateRequest request) {
        profileService.updateUserProfile(token, request);
        return ResponseEntity.ok(Map.of("message", "프로필이 수정되었습니다."));
    }

    /**
     * ✅ 프로필 이미지 업로드
     */
    @PostMapping("/image")
    public ResponseEntity<?> uploadProfileImage(@RequestHeader("Authorization") String token,
                                                @RequestPart("file") MultipartFile file) {
        String imageUrl = profileService.uploadProfileImage(token, file);
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }
}
