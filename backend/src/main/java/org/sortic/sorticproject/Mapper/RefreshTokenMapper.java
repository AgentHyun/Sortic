package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.RefreshToken;

@Mapper
public interface RefreshTokenMapper {
    
    @Insert("REPLACE INTO refresh_token (user_id, token, expiry) " +
            "VALUES (#{userId}, #{token}, #{expiry})")
    void save(RefreshToken refreshToken);

    @Select("SELECT user_id, token, expiry " +
            "FROM refresh_token " +
            "WHERE user_id = #{userId}")
    RefreshToken find(String userId);

    @Delete("DELETE FROM refresh_token WHERE user_id = #{userId}")
    void delete(String userId);
}
