package org.sortic.sorticproject.Dto.response;

import lombok.*;
import org.sortic.sorticproject.Entity.Users;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private Users user;
}
