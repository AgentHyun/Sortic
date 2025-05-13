package org.sortic.sorticproject.security.token;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.RefreshToken;
import org.sortic.sorticproject.Mapper.RefreshTokenMapper;
import org.springframework.stereotype.Service;

/**
 * RefreshTokenService 구현체
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenMapper mapper;

    @Override
    public void save(String userId, String token, long expiry) {
        mapper.save(new RefreshToken(userId, token, expiry));
    }

    @Override
    public String find(String userId) {
        RefreshToken rt = mapper.find(userId);
        return rt == null ? null : rt.getToken();
    }

    @Override
    public void delete(String userId) {
        mapper.delete(userId);
    }
}
