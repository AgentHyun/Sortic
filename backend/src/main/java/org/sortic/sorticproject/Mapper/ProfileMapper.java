package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.Users;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileMapper {

    /** ✅ userId 기준 사용자 정보 조회 */
    @Select("SELECT * FROM Users WHERE user_id = #{userId}")
    Users findByUserId(@Param("userId") String userId);

    /** ✅ 사용자 정보 업데이트 (null 무시 처리) */
    @Update({
        "<script>",
        "UPDATE Users",
        "<set>",
        "  <if test='email != null'>email = #{email},</if>",
        "  <if test='phone != null'>phone = #{phone},</if>",
        "  <if test='password != null'>password = #{password},</if>",
        "</set>",
        "WHERE user_id = #{userId}",
        "</script>"
    })
    void updateUserProfile(Users user);

    /** ✅ 비밀번호 단독 변경 */
    @Update("UPDATE Users SET password = #{password} WHERE user_id = #{userId}")
    void updatePassword(@Param("userId") String userId, @Param("password") String encodedPassword);

    /** ✅ 프로필 이미지 경로 업데이트 */
    @Update("UPDATE Users SET profile_image = #{imageUrl} WHERE user_id = #{userId}")
    void updateProfileImage(@Param("userId") String userId, @Param("imageUrl") String imageUrl);
}
