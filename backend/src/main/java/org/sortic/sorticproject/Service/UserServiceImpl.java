package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    /** ✅ UserMapper 주입 */
    private final UserMapper userMapper;

    /** ✅ 아이디 중복 확인 */
    @Override
    public boolean checkUserId(String userId) {
        return !userMapper.existsByUserId(userId);
    }

    /** ✅ 상호명 중복 확인 */
    @Override
    public boolean checkStoreName(String storeName) {
        return !userMapper.existsByStoreName(storeName);
    }

    /** ✅ 이메일 + 상호명으로 사용자 아이디 찾기 */
    @Override
    public String findUserIdByEmailAndStoreName(String email, String storeName) {
        return userMapper.findUserIdByEmailAndStoreName(email, storeName)
            .orElseThrow(() -> new RuntimeException("일치하는 회원 정보가 없습니다."));
    }

    /** ✅ 임시 비밀번호 이메일 발송 (미구현) */
    @Override
    public void sendTemporaryPassword(String email) {
        throw new UnsupportedOperationException("임시 비밀번호 전송 기능은 아직 구현되지 않았습니다.");
    }

    /** ✅ 상호 이미지 업로드 */
    @Override
    public String uploadStoreImage(String userId, MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename(); // ✅ 원본 파일명 추출
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // ✅ 확장자 추출
            String savedName = UUID.randomUUID() + extension; // ✅ 고유 파일명 생성
            String uploadPath = "uploads/store_images/" + savedName; // ✅ 저장 경로 지정

            File dest = new File(uploadPath); // ✅ 파일 객체 생성
            dest.getParentFile().mkdirs(); // ✅ 디렉토리 없으면 생성
            file.transferTo(dest); // ✅ 실제 파일 저장

            userMapper.updateStoreImage(userId, uploadPath); // ✅ DB 반영
            return uploadPath;
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
        }
    }

    /** ✅ 회원가입 시 사용자 주소 저장 */
    @Override
    public void saveUserAddress(String userId, String zipcode, String roadAddress, String detailAddress) {
        userMapper.updateUserAddress(userId, zipcode, roadAddress, detailAddress);
    }
}
