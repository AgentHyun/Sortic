package org.sortic.sorticproject.security.token;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.sortic.sorticproject.security.InvalidJwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 기반 인증 처리 필터 (모든 요청에서 실행됨)
 */
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String bearerToken = request.getHeader("Authorization");

            if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                // 1. 토큰 유효성 검사
                jwtTokenProvider.validate(bearerToken);

                // 2. 사용자 ID 추출
                String userId = jwtTokenProvider.getUserId(bearerToken);

                // 3. 인증 객체 생성 후 SecurityContext에 등록
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, null); // 권한 X
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("✅ 인증 완료: {}", userId);
            }
        } catch (InvalidJwtException e) {
            log.warn("❌ JWT 인증 실패: {}", e.getMessage());
            // 여기서 SecurityContextHolder.clearContext(); 해도 되고, 다음 필터에 맡겨도 됨
        }

        // 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}
