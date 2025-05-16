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
                    <div style='font-family:Arial,sans-serif; padding:24px;'>
                        <h2>🔐 이메일 인증 요청</h2>
                        <p>아래 인증번호를 입력해주세요:</p>
                        <div style='margin-top:16px; font-size:24px; font-weight:bold; color:#2b6cb0;'>
                            %s
                        </div>
                        <p style='margin-top:24px; font-size:12px; color:#999;'>본 인증번호는 5분간 유효합니다.</p>
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
