package org.sortic.sorticproject.Dto.request;

import lombok.*;

@Getter
@Setter
public class LoginRequest {
    private String userId;
    private String password;
}
