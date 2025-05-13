package org.sortic.sorticproject.security;

import org.springframework.security.core.AuthenticationException;

/**
 * [JWT 검증 실패 전용 예외]
 * - JwtAuthenticationFilter에서 던지면
 * - Spring Security가 잡아서 AuthenticationEntryPoint로 넘김
 */
public class InvalidJwtException extends AuthenticationException {

    public InvalidJwtException(String message) {
        super(message);
    }

    public InvalidJwtException(String message, Throwable cause) {
        super(message, cause);
    }
}
