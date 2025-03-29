package com.example.demo.card.controller;

import com.example.demo.card.dto.Element;
import com.example.demo.card.service.ElementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elements")
public class ElementController {

    @Autowired
    private ElementService elementService;

    // 상품 추가
    @PostMapping("/add_element")
    public String addElement(@RequestBody Element element) {
        elementService.addElement(element);
        return "상품이 성공적으로 추가되었습니다!";
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

    // 상품 수정
    @PutMapping("/update_element")
    public String updateElement(@RequestParam int category_id, @RequestParam String elements_name ) {
        elementService.updateElement(category_id, elements_name);
        return "상품이 성공적으로 수정되었습니다!";
    }

    // 상품 삭제
    @DeleteMapping("/delete_element")
    public String deleteElement(@RequestParam int elements_name_id) {
        elementService.deleteElement(elements_name_id);
        return "상품이 성공적으로 삭제되었습니다!";
    }
}
