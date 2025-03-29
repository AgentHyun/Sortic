package com.example.demo.card.mapper;

import com.example.demo.card.dto.Element;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface ElementMapper {

    // 상품 추가
    @Insert("INSERT INTO Elements_name (category_id, elements_name, elements_price, elements_image) " +
            "VALUES (#{category_id}, #{elements_name}, #{elements_price}, #{elements_image})")
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
            "WHERE category_id = #{category_id}")
    void updateElement(@Param("category_id") int elements_name_id, @Param("elements_name") String elements_name);

    // 상품 삭제
    @Delete("DELETE FROM Elements_name WHERE elements_name_id = #{elements_name_id}")
    void deleteElement(int elements_name_id);

    
}
