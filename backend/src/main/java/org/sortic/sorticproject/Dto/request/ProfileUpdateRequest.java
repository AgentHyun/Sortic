package org.sortic.sorticproject.Dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * 프로필 수정 요청 DTO
 * 클라이언트가 수정할 수 있는 필드만 포함
 */
@Getter
@Setter
public class ProfileUpdateRequest {

    /** 변경할 비밀번호 (선택적) */
    private String password;

    /** 상호명 */
    private String storeName;

    /** 이메일 (이메일 인증 완료된 경우에만 수정 허용) */
    private String email;

    /** 연락처 */
    private String phone;
}
