// ✅ EmailController.java
package org.sortic.sorticproject.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Dto.request.EmailRequest;
import org.sortic.sorticproject.Dto.request.EmailVerifyRequest;
import org.sortic.sorticproject.Service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    /** ✅ 인증번호 발송 */
    @PostMapping("/send-code")
    public ResponseEntity<?> sendAuthCode(@RequestBody @Valid EmailRequest request) {
        emailService.sendCode(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "인증번호가 전송되었습니다."));
    }

    /** ✅ 인증번호 검증 */
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyAuthCode(@RequestBody @Valid EmailVerifyRequest request) {
        boolean isValid = emailService.verifyCode(request.getEmail(), request.getCode());
        if (!isValid) {
            return ResponseEntity.badRequest().body(Map.of("message", "인증번호가 올바르지 않거나 만료되었습니다."));
        }
        return ResponseEntity.ok(Map.of(
            "message", "인증되었습니다.",
            "verified", true));
    }
};
