package org.sortic.sorticproject.Entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    private String userId;     // 유저 아이디 (Users.user_id 참조)
    private String token;      // 리프레시 토큰 문자열
    private long expiry;       // 만료 시간 (Unix Timestamp로 관리)
}

