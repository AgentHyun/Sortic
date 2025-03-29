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
    public String deleteCategory(@RequestParam String category_id) {
        categoryService.deleteCategoryById(category_id);
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

    @GetMapping("/get_first_category")
    public Category getFirstCategory(@RequestParam String user_id) {
        List<Category> categories = categoryService.getCategoriesByUserId(user_id);
        if (categories != null && !categories.isEmpty()) {
            return categories.get(0); // 첫 번째 카테고리 반환
        }
        return null; // 카테고리가 없는 경우

    
    }

    // 최대 category_id 조회
    @GetMapping("/max_category_id")
    public Integer getMaxCategoryId() {
        return categoryService.getMaxCategoryId();
    }

    // 최소 category_id 조회
    @GetMapping("/min_category_id")
    public Integer getMinCategoryId() {
        return categoryService.getMinCategoryId();
    }

    @PutMapping("/update_category_name")
    public String updateCategoryName(@RequestParam int category_id, @RequestParam String category_name) {
    categoryService.updateCategoryName(category_id, category_name);
    return "카테고리 이름이 성공적으로 업데이트되었습니다!";
}
}
