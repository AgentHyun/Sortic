package org.sortic.sorticproject.Mapper;



import org.sortic.sorticproject.Entity.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CategoryMapper {

    // 카테고리 추가
    @Insert("INSERT INTO Categories (user_id, category_name) VALUES (#{userId}, #{categoryName})")
    void insertCategory(Category category);

    // 카테고리 삭제
    @Delete("DELETE FROM Categories WHERE category_id = #{categoryId}")
    void deleteCategoryById(int categoryId);

    // 사용자 ID로 카테고리 목록 조회
    @Select("SELECT category_id, user_id AS userId, category_name AS categoryName, created_category_time " +
            "FROM Categories WHERE user_id = #{userId}")
    List<Category> getCategoriesByUserId(@Param("userId") String userId);

    // 사용자 ID와 카테고리 ID로 카테고리 이름 조회
    @Select("SELECT category_id, user_id AS userId, category_name AS categoryName, created_category_time " +
            "FROM Categories WHERE user_id = #{userId} AND category_id = #{categoryId}")
    Category getCategoryById(@Param("userId") String userId, @Param("categoryId") int categoryId);

    // 최대 category_id 조회
    @Select("SELECT MAX(category_id) FROM Categories")
    Integer getMaxCategoryId();

    // 최소 category_id 조회
    @Select("SELECT MIN(category_id) FROM Categories")
    Integer getMinCategoryId();
    @Update("UPDATE Categories SET category_name = #{category_name} WHERE category_id = #{category_id}")
    void updateCategoryName(@Param("category_id") int category_id, @Param("category_name") String category_name);

    @Select("SELECT COUNT(*) FROM Categories WHERE user_id = #{userId}")
    int countCategoriesByUserId(@Param("userId") String userId);

}
