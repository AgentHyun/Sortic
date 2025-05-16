// ✅ UserServiceImpl 클래스 - SignupRequest 기반 리팩토링
package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Dto.request.SignupRequest;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.RedisTemplate;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, String> redisTemplate;

    /** ✅ 아이디 중복 확인 */
    @Override
    public boolean checkUserId(String userId) {
        return !userMapper.existsByUserId(userId);
    }

    /** ✅ 상호명 중복 확인 */
    @Override
    public boolean checkStoreName(String storeName) {
        return !userMapper.existsByStoreName(storeName);
    }

    /** ✅ 회원가입 처리 (이메일 인증 검증 포함) */
    @Override
    public void signup(SignupRequest request) {
        if (!checkUserId(request.getUserId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        if (!checkStoreName(request.getStoreName())) {
            throw new IllegalArgumentException("이미 사용 중인 상호명입니다.");
        }

        // ✅ 이메일 인증 여부 확인
        String email = request.getEmail();
        String code = redisTemplate.opsForValue().get(email);
        if (code == null) {
            throw new IllegalArgumentException("이메일 인증이 완료되지 않았습니다.");
        }
        redisTemplate.delete(email); // 인증 정보 제거 (1회용)

        String userId = request.getUserId();
        String password = request.getPassword();

        if (password.contains(userId.substring(0, Math.min(3, userId.length())))) {
            throw new IllegalArgumentException("비밀번호에 아이디의 연속된 3자 이상을 포함할 수 없습니다.");
        }

        Users user = new Users();
        user.setUserId(userId);
        user.setPassword(passwordEncoder.encode(password));
        user.setStore_name(request.getStoreName());
        user.setEmail(email);
        user.setPhone(request.getPhone());

        userMapper.insertUser(user);
    }

    /** ✅ 이메일 + 상호명으로 사용자 아이디 찾기 */
    @Override
    public String findUserIdByEmailAndStoreName(String email, String storeName) {
        return userMapper.findUserIdByEmailAndStoreName(email, storeName)
            .orElseThrow(() -> new RuntimeException("일치하는 회원 정보가 없습니다."));
    }

    /** ✅ 임시 비밀번호 이메일 발송 (미구현) */
    @Override
    public void sendTemporaryPassword(String email) {
        throw new UnsupportedOperationException("임시 비밀번호 전송 기능은 아직 구현되지 않았습니다.");
    }
}
