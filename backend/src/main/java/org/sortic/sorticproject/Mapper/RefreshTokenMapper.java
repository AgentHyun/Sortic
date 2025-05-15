package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.RefreshToken;

@Mapper
public interface RefreshTokenMapper {

    // 저장 또는 갱신 (upsert 유사)
    @Insert("""
        INSERT INTO refresh_token (user_id, token, expiry)
        VALUES (#{userId}, #{token}, #{expiry})
        ON DUPLICATE KEY UPDATE token = #{token}, expiry = #{expiry}
    """)
    void save(RefreshToken refreshToken);

    // 사용자 ID로 토큰 조회
    @Select("SELECT user_id, token, expiry FROM refresh_token WHERE user_id = #{userId}")
    RefreshToken findByUserId(String userId);

    // 삭제
    @Delete("DELETE FROM refresh_token WHERE user_id = #{userId}")
    void deleteByUserId(String userId);
}
