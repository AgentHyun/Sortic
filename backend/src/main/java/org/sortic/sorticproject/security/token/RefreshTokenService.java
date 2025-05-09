package org.sortic.sorticproject.security.token;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Mapper.RefreshTokenMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenMapper refreshTokenMapper;

    public void save(String userId, String token, long expiry) {
        refreshTokenMapper.save(userId, token, expiry);
    }

    public String find(String userId) {
        return refreshTokenMapper.find(userId);
    }

    public void delete(String userId) {
        refreshTokenMapper.delete(userId);
    }
}
