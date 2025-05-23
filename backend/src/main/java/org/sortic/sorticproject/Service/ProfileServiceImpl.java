package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.sortic.sorticproject.Dto.request.ProfileUpdateRequest;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Mapper.ProfileMapper;
import org.sortic.sorticproject.security.token.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileMapper profileMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    /** ✅ 사용자 조회 */
    @Override
    public Users getUserProfile(String token) {
        String userId = jwtTokenProvider.getUserId(token.replace("Bearer ", ""));
        return profileMapper.findByUserId(userId);
    }

    /** ✅ 사용자 수정 */
    @Override
    public void updateUserProfile(String token, ProfileUpdateRequest request) {
        String userId = jwtTokenProvider.getUserId(token.replace("Bearer ", ""));

        Users updated = new Users();
        updated.setUserId(userId);
        updated.setStoreName(request.getStoreName());
        updated.setEmail(request.getEmail());
        updated.setPhone(request.getPhone());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            updated.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        profileMapper.updateUserProfile(updated);
    }

    /** ✅ 프로필 이미지 업로드 */
    @Override
    public String uploadProfileImage(String token, MultipartFile file) {
        String userId = jwtTokenProvider.getUserId(token.replace("Bearer ", ""));

        // 임시 저장 경로 설정 (운영 환경에서는 S3 또는 별도 디렉토리 사용 권장)
        String uploadDir = "./uploads/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + fileName;

        try {
            file.transferTo(new File(filePath));
        } catch (IOException e) {
            log.error("이미지 저장 실패", e);
            throw new RuntimeException("이미지 저장 실패");
        }

        String imageUrl = "/images/" + fileName; // 프론트에서 접근 가능한 경로로 가정
        profileMapper.updateProfileImage(userId, imageUrl);
        return imageUrl;
    }
}
