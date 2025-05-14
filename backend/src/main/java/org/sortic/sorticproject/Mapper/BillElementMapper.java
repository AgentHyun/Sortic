package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.BillElement;

import java.util.List;

@Mapper
public interface BillElementMapper {

    // BillElement 추가
    @Insert("INSERT INTO Bill_Element (Bill_id, Elements_name_id,  Element_count ) VALUES (#{billId}, #{elementsNameId}),1")
    void insertBillElement(BillElement billElement);

    // BillElement 삭제
    @Delete("DELETE FROM Bill_Element WHERE Bill_Element_id = #{billElementId}")
    void deleteBillElementById(int billElementId);

    // BillElement 수정
    @Update("UPDATE Bill_Element SET Elements_name_id = #{elementsNameId}, Bill_id = #{billId} WHERE Bill_Element_id = #{billElementId}")
    void updateBillElement(BillElement billElement);

    // 특정 Bill에 대한 모든 BillElement 조회
    @Select("SELECT * FROM Bill_Element WHERE Bill_id = #{billId}")
    List<BillElement> findBillElementsByBillId(@Param("billId") int billId);

    // 특정 Element에 대한 모든 BillElement 조회
    @Select("SELECT * FROM Bill_Element WHERE Elements_name_id = #{elementsNameId}")
    List<BillElement> findBillElementsByElementId(@Param("elementsNameId") int elementsNameId);

    @Insert({
        "<script>",
        "INSERT INTO Bill_Element (Bill_id, Elements_name_id) VALUES ",
        "<foreach collection='billElements' item='billElement' separator=','>",
        "(#{billElement.billId}, #{billElement.elementsNameId})",
        "</foreach>",
        "</script>"
    })
    void insertMultipleBillElements(@Param("billElements") List<BillElement> billElements);
}
