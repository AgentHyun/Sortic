package org.sortic.sorticproject.Dto.response;

import lombok.*;

@Getter @AllArgsConstructor
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
}
