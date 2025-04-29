package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.sortic.sorticproject.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    /** 회원가입 처리 */
    @Override
    public ResponseEntity<?> signup(Users user) {
        try {
            // 아이디 중복 체크
            if (userMapper.findByUserId(user.getUserId()) != null) {
                return ResponseEntity.badRequest().body("이미 존재하는 아이디입니다.");
            }
            // 비밀번호 암호화 후 저장
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userMapper.insertUser(user);
            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** 아이디 중복 확인 */
    @Override
    public ResponseEntity<?> checkUserId(String userId) {
        try {
            boolean exists = userMapper.findByUserId(userId) != null;
            return ResponseEntity.ok(!exists);  // 사용 가능하면 true
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** 로그인 처리 */
    @Override
    public ResponseEntity<?> login(Users user) {
        try {
            Users foundUser = userMapper.findByUserId(user.getUserId());
            if (foundUser == null) {
                return ResponseEntity.badRequest().body("존재하지 않는 아이디입니다.");
            }
            if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.badRequest().body("비밀번호가 일치하지 않습니다.");
            }
            String token = tokenProvider.createToken(foundUser.getUserId());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", foundUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** JWT 토큰 생성 유틸 호출 */
    @Override
    public String generateJwtToken(Users user) {
        return tokenProvider.createToken(user.getUserId());
    }

    /** 클라이언트 로그아웃용 스텁 */
    @Override
    public void logout(String user_id) {
        // 토큰 블랙리스트 구현 시 추가
    }
}
