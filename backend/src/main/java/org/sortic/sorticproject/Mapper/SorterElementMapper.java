package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.SorterElement;

import java.util.List;

@Mapper
public interface SorterElementMapper {

    // 정렬자 ID로 연결된 요소 ID들 가져오기
    @Select("SELECT elements_id FROM Sorter_Element WHERE sorter_id = #{sorter_id}")
    List<Integer> findElementIdsBySorterId(@Param("sorter_id") int sorterId);

    // 정렬자 ID로 연결된 SorterElement 전체 가져오기
    @Select("SELECT * FROM Sorter_Element WHERE sorter_id = #{sorter_id}")
    List<SorterElement> findBySorterId(@Param("sorter_id") int sorterId);

    // 요소 ID로 연결된 SorterElement 전체 가져오기
    @Select("SELECT * FROM Sorter_Element WHERE elements_id = #{elements_id}")
    List<SorterElement> findAllByElementId(@Param("elements_id") int elementId);

    // 정렬자에 요소 추가
    @Insert("INSERT INTO Sorter_Element (sorter_id, elements_id) VALUES (#{sorter_id}, #{elements_id})")
    void insertSorterElement(SorterElement sorterElement);

    // 정렬자에서 요소 제거 (하나)
    @Delete("DELETE FROM Sorter_Element WHERE sorter_id = #{sorter_id} AND elements_id = #{elements_id}")
    void deleteSorterElement(@Param("sorter_id") int sorterId, @Param("elements_id") int elementId);

    // 특정 정렬자에 해당 요소가 이미 존재하는지 여부
    @Select("SELECT COUNT(*) > 0 FROM Sorter_Element WHERE sorter_id = #{sorter_id} AND elements_id = #{elements_id}")
    boolean existsBySorterIdAndElementId(@Param("sorter_id") int sorterId, @Param("elements_id") int elementId);

    // 정렬자에서 여러 요소 제거
    @Delete({
        "<script>",
        "DELETE FROM Sorter_Element",
        "WHERE sorter_id = #{sorter_id}",
        "AND elements_id IN",
        "<foreach item='id' collection='elementIds' open='(' separator=',' close=')'>",
        "#{id}",
        "</foreach>",
        "</script>"
    })
    void deleteBySorterIdAndElementIds(@Param("sorter_id") int sorterId, @Param("elementIds") List<Integer> elementIds);
}
