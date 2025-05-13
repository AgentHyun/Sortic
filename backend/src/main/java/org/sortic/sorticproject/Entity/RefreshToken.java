package org.sortic.sorticproject.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사용자 리프레시 토큰 엔티티
 */
@Getter
@Setter
@NoArgsConstructor                // 기본 생성자
@AllArgsConstructor               // 모든 필드 생성자
public class RefreshToken {
    private String userId;        // 사용자 ID (외래키)
    private String token;         // 리프레시 토큰 문자열
    private long expiry;          // 토큰 만료 시간 (예: UNIX 타임스탬프)
}
