package org.sortic.sorticproject.Controller;


import org.sortic.sorticproject.Entity.Category;
import org.sortic.sorticproject.Entity.Element;
import org.sortic.sorticproject.Mapper.CategoryMapper;
import org.sortic.sorticproject.Service.CategoryService;
import org.sortic.sorticproject.Service.ElementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ElementService elementService;

    @PostMapping("/add_category")
    public Category addCategory(@RequestBody Category category) {

        return categoryService.addCategory(category);
    }


    @PostMapping("/delete_category")
    public String deleteCategory(@RequestBody Category category) {
        categoryService.deleteCategoryById(category.getCategory_id());
        return "카테고리가 성공적으로 삭제되었습니다!";
    }


    // GET 방식으로 user_id로 카테고리 목록 조회
    @GetMapping("/get_category")
    public List<Category> getCategories(@RequestParam String userId) {
        return categoryService.getCategoriesByUserId(userId);
    }

    // 사용자 ID와 카테고리 ID로 카테고리 조회
    @GetMapping("/get_category_by_id")
    public Category getCategoryById(@RequestParam String userId, @RequestParam int category_id) {
        return categoryService.getCategoryById(userId, category_id);
    }

    @GetMapping("/get_first_category")
    public Category getFirstCategory(@RequestParam String userId) {
        List<Category> categories = categoryService.getCategoriesByUserId(userId);
        if (categories != null && !categories.isEmpty()) {
            return categories.get(0); // 첫 번째 카테고리 반환
        }
        return null; // 카테고리가 없는 경우


    }

    // 사용자 ID로 카테고리 개수 조회
    @GetMapping("/count_categories")
    public int countCategories(@RequestParam String userId) {
        return categoryService.countCategoriesByUserId(userId);
    }



    @PutMapping("/update_category_name")
    public String updateCategoryName(@RequestBody Category category) {
        categoryService.updateCategoryName(category.getCategory_id(),category.getCategory_name());
        return "카테고리 이름이 성공적으로 업데이트되었습니다!";
    }
}
