package org.sortic.sorticproject;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 관련 설정을 담당하는 설정 클래스
 * CORS, 인터셉터, 리소스 핸들러 등을 설정할 수 있음
 */
@Configuration // 스프링의 설정 클래스임을 나타내는 어노테이션
public class WebConfig implements WebMvcConfigurer {
    
    /**
     * CORS(Cross-Origin Resource Sharing) 설정을 정의하는 메서드
     * 프론트엔드와 백엔드 간의 교차 출처 리소스 공유를 허용
     * 
     * @param registry CORS 설정을 등록하기 위한 CorsRegistry 객체
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 CORS 설정 적용
                .allowedOrigins("http://localhost:3000") // React 애플리케이션의 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true) // 인증 정보(쿠키 등) 허용
                .maxAge(3600); // CORS preflight 요청 결과를 캐시하는 시간 (초)
    }
}