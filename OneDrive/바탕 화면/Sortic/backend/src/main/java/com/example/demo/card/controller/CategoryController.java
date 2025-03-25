package com.example.demo.card.controller;

import com.example.demo.card.dto.Category;
import com.example.demo.card.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("/add_category")
    public Category addCategory(@RequestBody Category category) {

        return categoryService.addCategory(category);
    }

    @PostMapping("/delete_category")
    public String deleteCategory(@RequestParam String category_name) {
        categoryService.deleteCategoryByName(category_name);
        return "카테고리가 성공적으로 삭제되었습니다!";
    }

    // GET 방식으로 user_id로 카테고리 목록 조회
    @GetMapping("/get_category")
    public List<Category> getCategories(@RequestParam String user_id) {
        return categoryService.getCategoriesByUserId(user_id);
    }

    // 사용자 ID와 카테고리 ID로 카테고리 조회
    @GetMapping("/get_category_by_id")
    public Category getCategoryById(@RequestParam String user_id, @RequestParam int category_id) {
        return categoryService.getCategoryById(user_id, category_id);
    }
}
