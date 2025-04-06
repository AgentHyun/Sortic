package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.Element;

import java.util.List;

@Mapper
public interface ElementMapper {

    // ✅ 상품 추가 + 자동 생성된 ID 반환
    @Insert("INSERT INTO Elements_name (category_id, elements_name, elements_price, elements_image) " +
            "VALUES (#{category_id}, #{elements_name}, #{elements_price}, #{elements_image})")
    @Options(useGeneratedKeys = true, keyProperty = "elements_name_id")
    void insertElement(Element element);

    // 상품 조회
    @Select("SELECT * FROM Elements_name WHERE elements_name_id = #{elements_name_id}")
    @Results({
            @Result(property = "elements_name_id", column = "elements_name_id"),
            @Result(property = "category_id", column = "category_id"),
            @Result(property = "elements_name", column = "elements_name"),
            @Result(property = "elements_price", column = "elements_price"),
            @Result(property = "elements_image", column = "elements_image")
    })
    Element getElementById(int elements_name_id);

    // 카테고리별 상품 목록 조회
    @Select("SELECT * FROM Elements_name WHERE category_id = #{category_id}")
    @Results({
            @Result(property = "elements_name_id", column = "elements_name_id"),
            @Result(property = "category_id", column = "category_id"),
            @Result(property = "elements_name", column = "elements_name"),
            @Result(property = "elements_price", column = "elements_price"),
            @Result(property = "elements_image", column = "elements_image")
    })
    List<Element> getElementsByCategoryId(int category_id);

    // 상품 수정
    @Update("UPDATE Elements_name SET elements_name = #{elements_name}" +
            "WHERE elements_name_id = #{elements_name_id}")
    void updateElement(@Param("elements_name_id") int elements_name_id, @Param("elements_name") String elements_name);

    // 상품 삭제
    @Delete("DELETE FROM Elements_name WHERE elements_name_id = #{elements_name_id}")
    void deleteElement(int elements_name_id);
    // 다중 요소 삭제용 메서드 추가
    @Delete({
            "<script>",
            "DELETE FROM Elements_name WHERE elements_name_id IN",
            "<foreach item='id' collection='ids' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    void deleteElementsByIds(@Param("ids") List<Integer> ids);


}
