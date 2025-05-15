// WholesaleMapper.java
package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.UserWholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleLink;

import java.util.List;

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
    int isUserWholesaleCodeExists(@Param("code") String code);
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

}
