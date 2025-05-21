package org.sortic.sorticproject.Mapper;

import org.sortic.sorticproject.Entity.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CategoryMapper {

    // 카테고리 추가
    @Insert("""
        INSERT INTO Categories (user_id, category_name, wholesaler_code)
        VALUES (#{user_id}, #{category_name}, #{wholesaler_code})
    """)
    void insertCategory(Category category);

    // 카테고리 삭제
    @Delete("DELETE FROM Categories WHERE category_id = #{category_id}")
    void deleteCategoryById(@Param("category_id") int category_id);

    // 사용자 ID로 카테고리 목록 조회
    @Select("""
        SELECT category_id, user_id, category_name, created_category_time, wholesaler_code
        FROM Categories
        WHERE user_id = #{user_id}
    """)
    List<Category> getCategoriesByUserId(@Param("user_id") String user_id);

    // 사용자 ID와 카테고리 ID로 카테고리 조회
    @Select("""
        SELECT category_id, user_id, category_name, created_category_time, wholesaler_code
        FROM Categories
        WHERE user_id = #{user_id} AND category_id = #{category_id}
    """)
    Category getCategoryById(@Param("user_id") String user_id, @Param("category_id") int category_id);

    // 카테고리 이름 수정
    @Update("""
        UPDATE Categories
        SET category_name = #{category_name}
        WHERE category_id = #{category_id}
    """)
    void updateCategoryName(@Param("category_id") int category_id, @Param("category_name") String category_name);

    // 사용자 ID로 카테고리 개수 조회
    @Select("SELECT COUNT(*) FROM Categories WHERE user_id = #{user_id}")
    int countCategoriesByUserId(@Param("user_id") String user_id);

    // 최대 category_id 조회
    @Select("SELECT MAX(category_id) FROM Categories")
    Integer getMaxCategoryId();

    // 최소 category_id 조회
    @Select("SELECT MIN(category_id) FROM Categories")
    Integer getMinCategoryId();

    // wholesaler_code로 카테고리 조회
    @Select("""
        SELECT category_id, user_id, category_name, created_category_time, wholesaler_code
        FROM Categories
        WHERE wholesaler_code = #{wholesaler_code}
    """)
    List<Category> getCategoriesByWholesalerCode(@Param("wholesaler_code") int wholesaler_code);
}
