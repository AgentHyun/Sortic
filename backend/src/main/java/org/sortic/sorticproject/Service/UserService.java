// ✅ UserService 인터페이스
package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Dto.request.SignupRequest;

public interface UserService {

    /** ✅ 아이디 중복 확인 */
    boolean checkUserId(String userId);

    /** ✅ 상호명 중복 확인 */
    boolean checkStoreName(String storeName);

    /** ✅ 회원가입 처리 */
    void signup(SignupRequest request);

    /** ✅ 아이디 찾기 */
    String findUserIdByEmailAndStoreName(String email, String storeName);

    /** ✅ 임시 비밀번호 발송 */
    void sendTemporaryPassword(String email);
}
