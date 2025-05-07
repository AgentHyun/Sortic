package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.sortic.sorticproject.Entity.RefreshToken;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface RefreshTokenMapper {
    void save(RefreshToken token);                // INSERT or REPLACE
    RefreshToken find(@Param("userId") String id);
    void delete(@Param("userId") String id);
}
