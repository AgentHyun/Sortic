package org.sortic.sorticproject.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

/**
 * Spring Security 관련 설정을 담당하는 설정 클래스
 * 최신 Spring Security 권장 방식으로 구현
 */
@Configuration // 스프링의 설정 클래스임을 나타내는 어노테이션
@EnableWebSecurity // Spring Security 설정을 활성화하는 어노테이션
public class SecurityConfig {

    /**
     * 비밀번호 암호화를 위한 PasswordEncoder 빈을 생성
     * BCrypt 해시 함수를 사용하여 비밀번호를 안전하게 암호화
     * 
     * @return BCryptPasswordEncoder 인스턴스
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Spring Security의 필터 체인을 구성하는 메서드
     * Lambda DSL을 사용한 최신 방식의 보안 설정
     * 
     * @param http HttpSecurity 객체
     * @return 구성된 SecurityFilterChain
     * @throws Exception 보안 구성 중 발생할 수 있는 예외
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            // CSRF 보호 비활성화 (REST API 서버이므로)
            .csrf(AbstractHttpConfigurer::disable)
            
            // CORS 설정 활성화 (WebConfig의 설정 사용)
            .cors(Customizer.withDefaults())
            
            // 요청에 대한 인증/인가 규칙 설정
            .authorizeHttpRequests(auth -> auth
                // 인증 관련 API는 모두 허용
                .requestMatchers("/api/auth/**").permitAll()
                // 그 외 요청은 인증 필요
                .anyRequest().authenticated()
            )
            
            // 폼 로그인 비활성화
            .formLogin(AbstractHttpConfigurer::disable)
            
            // HTTP Basic 인증 비활성화
            .httpBasic(AbstractHttpConfigurer::disable)
            
            // 최종 설정 빌드
            .build();
    }
} 