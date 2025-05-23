// ✅ ProfileService.java - 인터페이스
package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Dto.request.ProfileUpdateRequest;
import org.sortic.sorticproject.Entity.Users;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {

    // ✅ 토큰 기반 사용자 조회
    Users getUserProfile(String token);

    // ✅ 사용자 정보 수정
    void updateUserProfile(String token, ProfileUpdateRequest request);

    // ✅ 프로필 이미지 업로드
    String uploadProfileImage(String token, MultipartFile file);
}
