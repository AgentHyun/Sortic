// ✅ SignupRequest.java - 회원가입 요청 DTO (유효성 포함)
package org.sortic.sorticproject.Dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;

@Getter
public class SignupRequest {

    @NotBlank(message = "아이디는 필수입니다.")
    @Pattern(
        regexp = "^[a-zA-Z0-9@._-]{4,20}$",
        message = "아이디는 4~20자, 영어/숫자/@._-만 허용됩니다."
    )
    private String userId;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상 입력해 주세요.")
    private String password;

    @NotBlank(message = "상호명은 필수입니다.")
    @Size(min = 2, max = 10, message = "상호명은 2~10자 이내여야 합니다.")
    private String storeName;

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "유효한 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(regexp = "^\\d{11}$", message = "전화번호는 숫자만 11자리로 입력해주세요.")
    private String phone;

    @AssertTrue(message = "개인정보 취급방침에 동의해야 합니다.")
    private boolean agree;
}
