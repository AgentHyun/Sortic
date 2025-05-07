package org.sortic.sorticproject.Service;

import org.springframework.http.HttpStatus;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.sortic.sorticproject.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;

import org.sortic.sorticproject.security.token.RefreshTokenService;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;

import org.sortic.sorticproject.security.InvalidJwtException;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    // 필드 선언부에 주입 추가 ❷
    private final RefreshTokenService refreshTokenService;
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

    /** 로그인 처리 (Access + Refresh Token 발급) */
    @Override
    public ResponseEntity<?> login(Users user) {
        try {
            // 1) 사용자 조회 & 비밀번호 검증
            Users foundUser = userMapper.findByUserId(user.getUserId());
            if (foundUser == null
                || !passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("아이디 또는 비밀번호가 일치하지 않습니다.");
            }

            // 2) 토큰 발급: Access 15분, Refresh 7일(10080분)
            String accessToken  = tokenProvider.createToken(foundUser.getUserId(), 15);
            String refreshToken = tokenProvider.createToken(foundUser.getUserId(), 10080);

            // 3) Refresh-Token DB(MyBatis) 저장 (유효기간 expiry 계산)
            long expiryMillis = System.currentTimeMillis() + Duration.ofDays(7).toMillis();
            refreshTokenService.save(foundUser.getUserId(), refreshToken, expiryMillis);

            // 4) HttpOnly 쿠키로 Refresh-Token 세팅
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)                 // HTTPS 환경에서만 전송
                .path("/api/auth")            // refresh 엔드포인트 경로
                .maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();

            // 5) 응답 바디에 Access-Token + 유저 정보 담기
            Map<String, Object> body = new HashMap<>();
            body.put("token", accessToken);
            body.put("user", foundUser);

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(body);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
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
    @Override
    public ResponseEntity<?> refresh(String refreshToken) {
        // 1) 토큰 유효성 검사 (예외 발생 시 catch로 넘어갑니다)
        try {
            tokenProvider.validate(refreshToken);
        } catch (InvalidJwtException e) {
            return ResponseEntity.status(401).body("Refresh 만료");
        }

        // 2) DB에 저장된 토큰과 일치하는지 확인
        String userId = tokenProvider.getUserId(refreshToken);
        String stored = refreshTokenService.find(userId);
        if (!refreshToken.equals(stored)) {
            return ResponseEntity.status(401).body("Refresh 불일치");
        }

        // 3) 새 Access Token 발급
        String newAccess = tokenProvider.createToken(userId, 15);
        return ResponseEntity.ok(Map.of("token", newAccess));
    }
}
