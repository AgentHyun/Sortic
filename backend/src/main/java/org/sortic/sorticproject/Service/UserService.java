package org.sortic.sorticproject.Service;

import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    /** ✅ 아이디 중복 확인 */
    boolean checkUserId(String userId);

    /** ✅ 상호명 중복 확인 */
    boolean checkStoreName(String storeName);

    /** ✅ 아이디 찾기 */
    String findUserIdByEmailAndStoreName(String email, String storeName);

    /** ✅ 임시 비밀번호 발송 */
    void sendTemporaryPassword(String email);

    /** ✅ 상호 이미지 업로드 */
    String uploadStoreImage(String userId, MultipartFile file);

    /** ✅ 주소 등록 (회원가입 시) */
    void saveUserAddress(String userId, String zipcode, String roadAddress, String detailAddress);
}
