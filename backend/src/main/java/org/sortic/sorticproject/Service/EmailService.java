// ✅ EmailService.java (Redis TTL 연동)
package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.sortic.sorticproject.Util.MailUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final RedisTemplate<String, String> redisTemplate;
    private final MailUtil mailUtil;
    private final Random random = new Random();

    /** ✅ 인증코드 생성 및 Redis 저장 (5분 TTL) + 메일 발송 */
    public void sendCode(String email) {
        String code = String.format("%06d", random.nextInt(999999));
        redisTemplate.opsForValue().set(email, code, Duration.ofMinutes(5));
        mailUtil.sendAuthCode(email, code);
        log.info("[Redis 저장] email={}, code={}, TTL=5분", email, code);
    }

    /** ✅ 인증코드 검증 (Redis 조회 및 삭제) */
    public boolean verifyCode(String email, String code) {
        String stored = redisTemplate.opsForValue().get(email);
        boolean match = stored != null && stored.equals(code);

        if (match) {
            // ✅ 인증 성공 → 인증 상태 플래그 저장 (10분 유효)
            redisTemplate.opsForValue().set(email + ":verified", "true", Duration.ofMinutes(10));
            redisTemplate.delete(email); // 인증번호 삭제
            log.info("[Redis 인증 성공] {} → verified 저장", email);
        }

        return match;
    }
//    public boolean verifyCode(String email, String code) {
//        String stored = redisTemplate.opsForValue().get(email);
//        boolean match = stored != null && stored.equals(code);
//        if (match) redisTemplate.delete(email); // ✅ 인증 후 삭제
//        return match;
//    }
}
