package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.Users;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

/**
 * 사용자 관련 비즈니스 로직을 정의하는 서비스 인터페이스
 * 사용자 정보 관리, 프로필 관리 등의 기능을 제공
 */
public interface UserService {
    /**
     * 새로운 사용자를 시스템에 등록
     */
    Users signup(Users user);

    /**
     * 사용자가 입력한 아이디의 중복 여부를 확인
     */
    boolean checkUserId(String user_id);

    /**
     * 사용자 아이디로 사용자 정보를 조회
     */
    Users findByUserId(String user_id);

    /**
     * 사용자 아이디의 존재 여부를 확인
     */
    boolean existsByUserId(String user_id);

    /**
     * 프로필 이미지 업로드
     */
    String uploadProfileImage(String user_id, MultipartFile file) throws IOException;

    /**
     * 기본 프로필 이미지 설정
     */
    void setDefaultProfileImage(String user_id);

    /**
     * 사용자 프로필 업데이트
     */
    void updateUserProfile(Users user);

    /**
     * 임시 비밀번호 발송
     */
    void sendTemporaryPassword(String email);

    /**
     * 이메일과 사용자 이름으로 아이디 찾기
     */
    String findUserIdByEmailAndUsername(String email, String username);

    /**
     * 비밀번호 변경
     */
    void changePassword(String user_id, String currentPassword, String newPassword);
}
