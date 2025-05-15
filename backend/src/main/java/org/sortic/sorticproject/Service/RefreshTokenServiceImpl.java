package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.RefreshToken;
import org.sortic.sorticproject.Mapper.RefreshTokenMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenMapper refreshTokenMapper;

    @Override
    public void save(String userId, String token, long expiry) {
        RefreshToken refreshToken = RefreshToken.builder()
            .userId(userId)
            .token(token)
            .expiry(expiry)
            .build();
        refreshTokenMapper.save(refreshToken);
    }

    @Override
    public String find(String userId) {
        RefreshToken token = refreshTokenMapper.findByUserId(userId);
        return token != null ? token.getToken() : null;
    }

    @Override
    public void delete(String userId) {
        refreshTokenMapper.deleteByUserId(userId);
    }
}
