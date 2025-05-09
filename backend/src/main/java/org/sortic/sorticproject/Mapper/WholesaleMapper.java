// WholesaleMapper.java
package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
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
    @Insert("INSERT INTO Wholesale_Link (wholesale_code_id, user_id, wholesale_name) VALUES (#{wholesaleCodeId}, #{userId}, #{wholesaleName})")
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
    WholesaleCode findWholesaleCodeByCode(int wholesaleCode);

    @Select("SELECT wholesale_code FROM Wholesale_Code WHERE wholesale_code_id = #{id}")
    Integer findWholesaleCodeById(@Param("id") int wholesaleCodeId);
    // Mapper
    @Select("""
    SELECT
        wholesale_code_id AS wholesaleCodeId,
        wholesale_code AS wholesaleCode,
        user_id AS userId
    FROM Wholesale_Code
    WHERE CAST(wholesale_code AS CHAR) LIKE CONCAT('%', #{keyword}, '%')
""")
    List<WholesaleCode> searchWholesaleCodesByKeyword(@Param("keyword") String keyword);

}
