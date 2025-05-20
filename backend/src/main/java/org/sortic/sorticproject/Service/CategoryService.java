package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.Category;
import org.sortic.sorticproject.Mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryMapper categoryMapper;

    // 생성자 주입을 통해 CategoryMapper 의존성 주입
    @Autowired
    public CategoryService(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    // 카테고리 추가
    public Category addCategory(Category category) {
        categoryMapper.insertCategory(category);
        return category;  // 추가된 카테고리 객체 반환
    }

    // 카테고리 삭제
    public void deleteCategoryById(int category_id) {
        categoryMapper.deleteCategoryById(category_id);
    }

    // 사용자 ID로 카테고리 목록 조회
    public List<Category> getCategoriesByUserId(String user_id) {
        return categoryMapper.getCategoriesByUserId(user_id);
    }// 사용자 ID로 카테고리 개수 조회
    public int countCategoriesByUserId(String user_id) {
        return categoryMapper.countCategoriesByUserId(user_id);
    }


    // 사용자 ID와 카테고리 ID로 카테고리 조회
    public Category getCategoryById(String user_id, int category_id) {
        return categoryMapper.getCategoryById(user_id, category_id);
    }

    // 카테고리 이름 수정
    public void updateCategoryName(int category_id, String category_name) {
        categoryMapper.updateCategoryName(category_id, category_name);
    }
    public List<Category> getCategoriesByWholesalerCode(int wholesaler_code) {
        return categoryMapper.getCategoriesByWholesalerCode(wholesaler_code);
    }

}
