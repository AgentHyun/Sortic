package org.sortic.sorticproject.Dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class SignupRequest {

    /** ✅ 아이디: 4~20자, 영문 + 숫자 + 언더바/마침표 조합 허용 (특수문자나 한글은 제외) */
    @NotBlank(message = "아이디는 필수 입력입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9_.]{4,20}$", message = "아이디는 4~20자의 영문자, 숫자, 언더바(_) 및 마침표(.)만 사용할 수 있습니다.")
    private String userId;

    /** ✅ 비밀번호: 6자 이상, 영문 + 숫자 + 특수문자 포함 권장 */
    @NotBlank(message = "비밀번호는 필수 입력입니다.")
    @Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+=-]).{6,}$",
        message = "비밀번호는 6자 이상이며, 영문/숫자/특수문자를 모두 포함해야 합니다."
    )
    private String password;

    /** ✅ 비밀번호 확인: 프론트에서만 비교용, 백엔드는 service 계층에서 비교 */
    @NotBlank(message = "비밀번호 확인은 필수입니다.")
    private String checkpassword;

    /** ✅ 상호명: 빈 값 불가 */
    @NotBlank(message = "상호명은 필수 입력입니다.")
    private String store_name;

    /** ✅ 이메일: 형식 체크 */
    @Email(message = "유효한 이메일 형식이 아닙니다.")
    private String email;

    /** ✅ 휴대폰 번호: 10~11자리 숫자만 허용 (하이픈 제외) */
    @NotBlank(message = "휴대폰 번호는 필수 입력입니다.")
    @Pattern(regexp = "^\\d{10,11}$", message = "휴대폰 번호는 숫자만 10~11자리로 입력해야 합니다.")
    private String phone;
}
