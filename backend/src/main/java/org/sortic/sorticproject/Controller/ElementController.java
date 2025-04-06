package org.sortic.sorticproject.Controller;


import org.sortic.sorticproject.Entity.Element;
import org.sortic.sorticproject.Service.ElementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/elements")
public class ElementController {

    @Autowired
    private ElementService elementService;

    // 상품 추가
    @PostMapping("/add_element")
    public Element addElement(@RequestBody Element element) {
        elementService.addElement(element);
        return element;
    }

    // 상품 조회
    @GetMapping("/get_element")
    public Element getElement(@RequestParam int elements_name_id) {
        return elementService.getElementById(elements_name_id);
    }

    // 카테고리별 상품 목록 조회
    @GetMapping("/get_elements_by_category")
    public List<Element> getElementsByCategory(@RequestParam int category_id) {
        return elementService.getElementsByCategoryId(category_id);
    }

    //상품 수정

    @PutMapping("/update_element")
    public String updateElement(@RequestBody Element element) {
        elementService.updateElement(element.getElements_name_id(), element.getElements_name());
        return "상품이 성공적으로 수정되었습니다!";
    }

    // 상품 삭제
    @DeleteMapping("/delete_element")
    public String deleteElement(@RequestParam int elements_name_id) {
        elementService.deleteElement(elements_name_id);
        return "상품이 성공적으로 삭제되었습니다!";
    }
    @DeleteMapping("/delete_multiple_elements")
    public ResponseEntity<String> deleteMultipleElements(@RequestBody Map<String, List<Integer>> payload) {
        List<Integer> ids = payload.get("elements_name_ids");
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().body("삭제할 ID 목록이 비어 있습니다.");
        }

        elementService.deleteElementsByIds(ids);
        return ResponseEntity.ok("요소들이 성공적으로 삭제되었습니다!");
    }

}
