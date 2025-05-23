// WholesaleMapper.java
package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.UserWholesaleCode;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Entity.WholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleLink;

import java.util.List;
import java.util.Map;

@Mapper
public interface WholesaleMapper {

    // 도매 코드 CRUD
    @Insert("INSERT INTO Wholesale_Code (wholesale_code, user_id) VALUES (#{wholesaleCode}, #{userId})")
    @Options(useGeneratedKeys = true, keyProperty = "wholesaleCodeId")
    void insertWholesaleCode(WholesaleCode code);

    @Select("SELECT * FROM Wholesale_Code WHERE user_id = #{userId}")
    List<WholesaleCode> getWholesaleCodesByUserId(String userId);

    @Delete("DELETE FROM Wholesale_Code WHERE wholesale_code_id = #{wholesaleCodeId}")
    void deleteWholesaleCode(int wholesaleCodeId);

    // 도매 링크 CRUD
    @Insert("""
    INSERT INTO Wholesale_Link
    (wholesale_code_id, user_id, wholesale_name, wholesale_memo)
    VALUES (#{wholesaleCodeId}, #{userId}, #{wholesaleName}, #{wholesaleMemo})
""")
    @Options(useGeneratedKeys = true, keyProperty = "wholesaleLinkId")
    void insertWholesaleLink(WholesaleLink link);


    @Select("SELECT * FROM Wholesale_Link WHERE user_id = #{userId}")
    @Results({
        @Result(column = "wholesale_link_id", property = "wholesaleLinkId"),
        @Result(column = "wholesale_code_id", property = "wholesaleCodeId"),
        @Result(column = "user_id", property = "userId"),
        @Result(column = "wholesale_name", property = "wholesaleName"),
        @Result(column = "created_at", property = "createdAt")
    })
    List<WholesaleLink> getWholesaleLinksByUserId(String userId);


    @Update("UPDATE Wholesale_Link SET wholesale_name = #{wholesaleName} WHERE wholesale_link_id = #{wholesaleLinkId}")
    void updateWholesaleLinkName(WholesaleLink link);

    @Delete("DELETE FROM Wholesale_Link WHERE wholesale_link_id = #{wholesaleLinkId}")
    void deleteWholesaleLink(int wholesaleLinkId);
    //래현 추가 user_id로 username찾는 로직
    @Select("SELECT username FROM Users WHERE user_id = #{userId}")
    String findUsernameByUserId(@Param("userId") String userId);

    @Select("SELECT * FROM Wholesale_Code WHERE wholesale_code = #{wholesaleCode}")
    @Results({
        @Result(column = "wholesale_code_id", property = "wholesaleCodeId"),
        @Result(column = "wholesale_code", property = "wholesaleCode"),
        @Result(column = "user_id", property = "userId")
    })
    WholesaleCode findWholesaleCodeByCode(@Param("wholesaleCode") String wholesaleCode);

    @Select("SELECT wholesale_code FROM Wholesale_Code WHERE wholesale_code_id = #{id}")
    Integer findWholesaleCodeById(@Param("id") int wholesaleCodeId);
    // Mapper
    @Select("""
    SELECT
        wc.wholesale_code_id,
        wc.wholesale_code,
        wc.user_id,
        u.username AS ignored_username
    FROM Wholesale_Code wc
    JOIN Users u ON wc.user_id = u.user_id
    WHERE CAST(wc.wholesale_code AS CHAR) LIKE CONCAT('%', #{keyword}, '%')
       OR u.username LIKE CONCAT('%', #{keyword}, '%')
""")
    @Results({
        @Result(column = "wholesale_code_id", property = "wholesaleCodeId"),
        @Result(column = "wholesale_code", property = "wholesaleCode"),
        @Result(column = "user_id", property = "userId")
    })
    List<WholesaleCode> searchWholesaleCodesByKeyword(@Param("keyword") String keyword);
    @Select("SELECT wholesale_memo FROM Wholesale_Link WHERE wholesale_link_id = #{linkId}")
    String getMemoByLinkId(@Param("linkId") int linkId);

    @Update("UPDATE Wholesale_Link SET wholesale_memo = #{wholesaleMemo} WHERE wholesale_link_id = #{wholesaleLinkId}")
    void updateMemo(WholesaleLink link);
    // 중복 체크용 쿼리
    @Select("SELECT COUNT(*) FROM User_Wholesale_Code WHERE user_wholesale_code = #{code}")
    int getUserWholesaleCodeExists(@Param("code") String code);
    // 등록 쿼리
    @Insert("""
    INSERT INTO User_Wholesale_Code (user_wholesale_code, user_id)
    VALUES (#{userWholesaleCode}, #{userId})
""")
    void insertUserWholesaleCode(UserWholesaleCode userCode);

    @Select("""
    SELECT wc.user_id
    FROM Wholesale_Link wl
    JOIN Wholesale_Code wc ON wl.wholesale_code_id = wc.wholesale_code_id
    WHERE wl.wholesale_name = #{wholesaleName}
""")
    String findUserIdByWholesaleName(@Param("wholesaleName") String wholesaleName);


    @Select("""
    SELECT *
    FROM User_Wholesale_Code
    WHERE user_id = #{userId}
""")
    @Results({
        @Result(column = "user_wholesale_code_id", property = "userWholesaleCodeId"),
        @Result(column = "user_wholesale_code", property = "userWholesaleCode"),
        @Result(column = "user_id", property = "userId")
    })
    List<UserWholesaleCode> getUserWholesaleCodesByUserId(@Param("userId") String userId);

    @Delete("DELETE FROM User_Wholesale_Code WHERE user_wholesale_code = #{userWholesaleCode}")
    void deleteUserWholesaleCode(@Param("userWholesaleCode") int userWholesaleCode);


    @Select("SELECT user_id FROM Wholesale_Code WHERE wholesale_code_id = #{wholesaleCodeId}")
    String findUserIdByWholesaleCodeId(@Param("wholesaleCodeId") int wholesaleCodeId);
    @Select("SELECT user_id FROM Users WHERE username = #{username} AND user_id NOT LIKE '%!_%' ESCAPE '!' LIMIT 1")
    String findUserIdByUsername(@Param("username") String username);


    @Select("SELECT user_wholesale_code_id FROM User_Wholesale_Code WHERE user_wholesale_code = #{code}")
    Integer findUserWholesaleCodeIdByCode(@Param("code") String userWholesaleCode);
    @Select("""
    SELECT COUNT(*)
    FROM User_Wholesale_Code
    WHERE user_wholesale_code = #{userWholesaleCode} AND user_id = #{userId}
""")
    int isUserWholesaleCodeExists(@Param("userWholesaleCode") String userWholesaleCode,
                                  @Param("userId") String userId);


    @Select("""
    SELECT COUNT(*)
    FROM Wholesale_Link
    WHERE wholesale_code_id = #{wholesaleCodeId} AND user_id = #{userId}
""")
    int countWholesaleLinks(@Param("wholesaleCodeId") int wholesaleCodeId, @Param("userId") String userId);
    @Select("SELECT COUNT(*) FROM user_wholesale_code WHERE user_id = #{userId}")
    int countLinksByUserId(@Param("userId") String userId);
    // userId로 사용자 조회
    @Select("SELECT * FROM Users WHERE user_id = #{userId}")
    Users findByUserId(@Param("userId") String userId);

    // wholesaler_code만 업데이트
    @Update("UPDATE Users SET wholesaler_code = #{wholesalerCode} WHERE user_id = #{userId}")
    void updateWholesalerCode(@Param("userId") String userId, @Param("wholesalerCode") String wholesalerCode);
    @Insert("""
    INSERT INTO Users (
        user_id, password, username, phone, wholesaler_code,
        email, region, grade, profile_image, is_cloned
    )
    VALUES (
        #{userId}, #{password}, #{username}, #{phone}, #{wholesaler_code},
        #{email}, #{region}, #{grade}, #{profile_image}, true
    )
""")

    void insertUser(Users user);

    @Select("SELECT COUNT(*) FROM Wholesale_Code WHERE user_id = #{userId}")
    int countWholesaleCodeByUser(@Param("userId") String userId);


    @Select("SELECT wholesaler_code FROM Users WHERE user_id = #{userId}")
    String getWholesalerCodeByUserId(@Param("userId") String userId);


    // mapper interface
    @Update("UPDATE Users SET is_cloned = #{isCloned} WHERE user_id = #{userId}")
    int updateClonedFlag(@Param("userId") String userId, @Param("isCloned") boolean isCloned);

    // WholesaleMapper.java
    @Select("SELECT COUNT(*) FROM users WHERE user_id LIKE CONCAT(#{userId}, '_%')")
    int countClonedUsers(String userId);

    @Select("""
    SELECT user_id
    FROM Users
    WHERE user_id LIKE CONCAT(#{originalUserId}, '!_%') ESCAPE '!'
      AND is_cloned = TRUE
    LIMIT 1
""")
    String findClonedUserId(@Param("originalUserId") String originalUserId);

    @Update("""
    UPDATE Wholesale_Code
    SET wholesale_code = #{userWholesaleCode}
    WHERE user_id = #{userId}
""")
    void updateWholesaleCodeByUserId(UserWholesaleCode userCode);


    @Select("select wholesale_name , wholesale_commission from wholesale_link where wholesale_link_id = #{wholesaleLinkId}")
    Map<String, Object> findUserIdAndWholesaleCommissionByWholesaleLinkId(@Param("wholesaleLinkId") int wholesaleLinkId);

    @Select("SELECT wholesale_commission FROM Wholesale_Link WHERE wholesale_link_id = #{wholesaleLinkId}")
    Integer getWholesaleCommissionById(@Param("wholesaleLinkId") int wholesaleLinkId);

}
