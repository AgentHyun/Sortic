package com.example.demo.card.service;

import com.example.demo.card.dto.Category;
import com.example.demo.card.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    // 카테고리 추가
    public void addCategory(Category category) {
        categoryMapper.insertCategory(category);
    }

    // 카테고리 삭제
    public void deleteCategoryByName(String category_name) {
        categoryMapper.deleteCategoryByName(category_name);
    }

    // 사용자 ID로 카테고리 목록 조회
    public List<Category> getCategoriesByUserId(String user_id) {
        return categoryMapper.getCategoriesByUserId(user_id);
    }

    // 사용자 ID와 카테고리 ID로 카테고리 조회
    public Category getCategoryById(String user_id, int category_id) {
        return categoryMapper.getCategoryById(user_id, category_id);
    }
}
