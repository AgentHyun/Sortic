package org.sortic.sorticproject.Util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MailUtil {

    private final JavaMailSender mailSender;

    /**
     * 인증코드 전송용 HTML 이메일
     * @param to 대상 이메일 주소
     * @param code 인증번호
     */
    public void sendAuthCode(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("[Sortic] 이메일 인증번호 안내");

            String content = """
                    <div style="max-width:480px; margin:0 auto; padding:32px 24px; background:#ffffff; border:1px solid #e0e0e0; border-radius:12px; font-family:Segoe UI, sans-serif; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                        <h2 style="margin:0 0 16px; font-size:20px; color:#333;">🔐 이메일 인증 요청</h2>
                        <p style="margin:0 0 16px; font-size:14px; color:#555;">
                            아래 인증번호를 입력해주세요.
                        </p>
                        <div style="margin:24px 0; padding:16px; background:#f0f4ff; border-radius:8px; text-align:center; font-size:28px; font-weight:600; color:#1a73e8; letter-spacing:2px;">
                            %s
                        </div>
                        <p style="margin-top:24px; font-size:12px; color:#888; text-align:center;">
                            인증번호는 <strong>5분간</strong> 유효합니다.<br/>
                            잘못된 요청이라면 이 메일은 무시해주세요.
                        </p>
                    </div>
                    """.formatted(code);

            helper.setText(content, true); // true = HTML
            mailSender.send(message);

            log.info("✅ 인증 메일 전송: {} → {}", code, to);
        } catch (MessagingException e) {
            log.error("❌ 인증 메일 전송 실패: {}", e.getMessage());
            throw new RuntimeException("이메일 전송 중 오류 발생", e);
        }
    }
}
