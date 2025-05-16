package org.sortic.sorticproject.Config;

import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.security.token.JwtAuthenticationFilter;
import org.sortic.sorticproject.security.token.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    /** ✅ 비밀번호 암호화 방식 설정 */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /** ✅ CORS 설정 */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // 프론트 주소
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /** ✅ Spring Security 필터 체인 설정 */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)

            .authorizeHttpRequests(auth -> auth
                // ✅ 인증 없이 허용해야 하는 경로
                .requestMatchers(
                    "/api/users/login",
                    "/api/users/signup",
                    "/api/auth/reissue",
                    "/api/users/check-userid",
                    "/api/users/check-store",
                    "/api/email/send-code",
                    "/api/email/verify-code",
                    "/api/users/register-address",
                    "/api/users/store-image",
                    "/api/users/find-id",
                    "/api/users/reset-password"
                ).permitAll()

                // ✅ Swagger, H2 콘솔 등 추가적으로 개발환경에서만 열리는 경로들
                .requestMatchers(
                    "/h2-console/**", "/swagger-ui/**", "/v3/api-docs/**"
                ).permitAll()

                // ✅ 그 외 경로는 인증 필요
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                new JwtAuthenticationFilter(jwtTokenProvider),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
