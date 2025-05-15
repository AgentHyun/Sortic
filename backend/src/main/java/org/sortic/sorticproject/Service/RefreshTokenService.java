package org.sortic.sorticproject.Service;

public interface RefreshTokenService {
    void save(String userId, String token, long expiry);
    String find(String userId);
    void delete(String userId);
}
