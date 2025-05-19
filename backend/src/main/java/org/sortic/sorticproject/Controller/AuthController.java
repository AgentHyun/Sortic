package org.sortic.sorticproject.Controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Dto.request.LoginRequest;
import org.sortic.sorticproject.Dto.response.TokenResponse;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Service.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** ✅ 로그인 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            TokenResponse token = authService.login(request);

            // ✅ refreshToken은 HttpOnly 쿠키로 저장
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", token.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/api")
                .maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(Map.of("accessToken", token.getAccessToken()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }


    /** ✅ 로그아웃 */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");
            authService.logout(userId);
            return ResponseEntity.ok(Map.of("message", "로그아웃되었습니다."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** ✅ 리프레시 토큰으로 AccessToken 재발급 */
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(Map.of("message", "RefreshToken 쿠키가 없습니다."));
        }

        try {
            TokenResponse newTokens = authService.reissue(refreshToken);

            // ✅ 새로운 refreshToken 쿠키 다시 설정
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newTokens.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/api")
                .maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();

            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(Map.of("accessToken", newTokens.getAccessToken()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
}
