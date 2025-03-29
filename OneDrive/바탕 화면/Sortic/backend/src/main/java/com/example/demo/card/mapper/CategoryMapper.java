package com.example.demo.card.mapper;

import com.example.demo.card.dto.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface CategoryMapper {

    // 카테고리 추가
    @Insert("INSERT INTO Categories (user_id, category_name) VALUES (#{user_id}, #{category_name})")
    void insertCategory(Category category);

    // 카테고리 삭제
    @Delete("DELETE FROM Categories WHERE category_id = #{category_id}")
    void deleteCategoryById(@Param("category_id") String category_id);

    // 사용자 ID로 카테고리 목록 조회
    @Select("SELECT category_id, user_id, category_name, created_category_time FROM Categories WHERE user_id = #{user_id}")
    List<Category> getCategoriesByUserId(@Param("user_id") String user_id);

    // 사용자 ID와 카테고리 ID로 카테고리 이름 조회
    @Select("SELECT category_id, user_id, category_name, created_category_time FROM Categories WHERE user_id = #{user_id} AND category_id = #{category_id}")
    Category getCategoryById(@Param("user_id") String user_id, @Param("category_id") int category_id);

      // 최대 category_id 조회
    @Select("SELECT MAX(category_id) FROM Categories")
      Integer getMaxCategoryId();
  
      // 최소 category_id 조회
    @Select("SELECT MIN(category_id) FROM Categories")
    Integer getMinCategoryId();
    @Update("UPDATE Categories SET category_name = #{category_name} WHERE category_id = #{category_id}")
    void updateCategoryName(@Param("category_id") int category_id, @Param("category_name") String category_name);
}
