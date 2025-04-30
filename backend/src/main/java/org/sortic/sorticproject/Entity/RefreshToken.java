package org.sortic.sorticproject.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    private String userId;
    private String token;
    private long   expiry;
}
