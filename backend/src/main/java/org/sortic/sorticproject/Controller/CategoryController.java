package org.sortic.sorticproject.Controller;

import lombok.extern.slf4j.Slf4j;
import org.sortic.sorticproject.Entity.Category;
import org.sortic.sorticproject.Service.CategoryService;
import org.sortic.sorticproject.Service.ElementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ElementService elementService;

    // ✅ 카테고리 추가 (wholesale_link_id도 포함된 상태로 처리 가능)
    @PostMapping("/add_category")
    public Category addCategory(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }

    // ✅ 카테고리 삭제
    @PostMapping("/delete_category")
    public String deleteCategory(@RequestBody Category category) {
        categoryService.deleteCategoryById(category.getCategory_id());
        return "카테고리가 성공적으로 삭제되었습니다!";
    }

    // ✅ user_id로 카테고리 목록 조회
    @GetMapping("/get_category")
    public List<Category> getCategories(@RequestParam("user_id") String userId) {
        log.info("🔍 getCategories 접근됨: {}", userId);
        return categoryService.getCategoriesByUserId(userId);
    }



    // ✅ user_id + category_id로 단일 카테고리 조회
    @GetMapping("/get_category_by_id")
    public Category getCategoryById(@RequestParam String userId, @RequestParam int category_id) {
        return categoryService.getCategoryById(userId, category_id);
    }

    // ✅ user_id로 첫 번째 카테고리 조회
    @GetMapping("/get_first_category")
    public Category getFirstCategory(@RequestParam String userId) {
        List<Category> categories = categoryService.getCategoriesByUserId(userId);
        if (categories != null && !categories.isEmpty()) {
            return categories.get(0);
        }
        return null;
    }

    // ✅ 카테고리 개수 조회
    @GetMapping("/count_categories")
    public int countCategories(@RequestParam("userId") String userId) {
        return categoryService.countCategoriesByUserId(userId);
    }

    // ✅ 카테고리 이름 수정
    @PutMapping("/update_category_name")
    public String updateCategoryName(@RequestBody Category category) {
        categoryService.updateCategoryName(category.getCategory_id(), category.getCategory_name());
        return "카테고리 이름이 성공적으로 업데이트되었습니다!";
    }


    // 도매 링크 ID로 카테고리 목록 조회
    @GetMapping("/get_by_wholesale_link")
    public List<Category> getCategoriesByWholesaleLinkId(@RequestParam int wholesaler_code) {
        return categoryService.getCategoriesByWholesalerCode(wholesaler_code);
    }



}
