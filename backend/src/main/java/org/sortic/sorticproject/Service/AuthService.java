package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Dto.request.LoginRequest;
import org.sortic.sorticproject.Dto.response.TokenResponse;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.sortic.sorticproject.security.InvalidJwtException;
import org.sortic.sorticproject.security.token.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider; // ✅ 인스턴스 주입

    /** ✅ 로그인 처리 */
    public TokenResponse login(LoginRequest request) {
        Users found = userMapper.findByUserId(request.getUserId());

        if (found == null || !passwordEncoder.matches(request.getPassword(), found.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtTokenProvider.createToken(found.getUserId(), 15);      // ✅ 변경
        String refreshToken = jwtTokenProvider.createToken(found.getUserId(), 10080);  // ✅ 변경

        long expiryMillis = System.currentTimeMillis() + Duration.ofDays(7).toMillis();
        refreshTokenService.save(found.getUserId(), refreshToken, expiryMillis);

        return new TokenResponse(accessToken, refreshToken);
    }

    /** ✅ 로그아웃 처리 */
    public void logout(String userId) {
        refreshTokenService.delete(userId);
    }

    /** ✅ AccessToken 재발급 */
    public TokenResponse reissue(String refreshToken) {
        try {
            jwtTokenProvider.validate(refreshToken); // ✅ 변경
        } catch (InvalidJwtException e) {
            throw new RuntimeException("Refresh 토큰이 만료되었습니다.");
        }

        String userId = jwtTokenProvider.getUserId(refreshToken); // ✅ 변경
        String stored = refreshTokenService.find(userId);

        if (!refreshToken.equals(stored)) {
            throw new RuntimeException("Refresh 토큰이 서버와 일치하지 않습니다.");
        }

        String newAccess = jwtTokenProvider.createToken(userId, 15);
        String newRefresh = jwtTokenProvider.createToken(userId, 10080);

        long expiryMillis = System.currentTimeMillis() + Duration.ofDays(7).toMillis();
        refreshTokenService.save(userId, newRefresh, expiryMillis);

        return new TokenResponse(newAccess, newRefresh);
    }

    /** ✅ 액세스 토큰 수동 발급 (테스트/내부용) */
    public String generateJwtToken(Users user) {
        return jwtTokenProvider.createToken(user.getUserId(), 15); // ✅ 변경
    }
}
