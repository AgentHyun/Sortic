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
    List<WholesaleLink> getWholesaleLinksByUserId(String userId);

    @Update("UPDATE Wholesale_Link SET wholesale_name = #{wholesaleName} WHERE wholesale_link_id = #{wholesaleLinkId}")
    void updateWholesaleLinkName(WholesaleLink link);

    @Delete("DELETE FROM Wholesale_Link WHERE wholesale_link_id = #{wholesaleLinkId}")
    void deleteWholesaleLink(int wholesaleLinkId);
}
