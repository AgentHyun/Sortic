package org.sortic.sorticproject.Entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshToken {
    private String userId;
    private String token;
    private long expiry;
}
