package org.sortic.sorticproject.Controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthRefreshController {

    private final AuthService authService;

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        String refresh = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("refreshToken".equals(c.getName())) {
                    refresh = c.getValue();
                }
            }
        }
        if (refresh == null) return ResponseEntity.status(401).body("Refresh 쿠키 없음");
        return authService.refresh(refresh);
    }
}
