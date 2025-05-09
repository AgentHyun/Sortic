package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Service.SorterElementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sorter-element")
public class SorterElementController {

    private final SorterElementService sorterElementService;

    @Autowired
    public SorterElementController(SorterElementService sorterElementService) {
        this.sorterElementService = sorterElementService;
    }

    // 특정 Sorter에 속한 Element ID 목록 가져오기
    @GetMapping("/sorter/{sorterId}")
    public ResponseEntity<?> getElementIdsBySorterId(@PathVariable int sorterId) {
        try {
            List<Integer> elementIds = sorterElementService.getElementIdsBySorterId(sorterId);
            return ResponseEntity.ok(elementIds);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("요소 ID 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 특정 Element ID로 요소 이름 가져오기
    @GetMapping("/element/{elementId}/name")
    public ResponseEntity<?> getElementNameById(@PathVariable int elementId) {
        try {
            String elementName = sorterElementService.getElementNameById(elementId);
            return ResponseEntity.ok(elementName);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("요소 이름 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 정렬자에 요소 추가
    @PostMapping("/add")
    public ResponseEntity<?> addElementToSorter(
        @RequestParam int sorterId,
        @RequestParam int elementId
    ) {
        try {
            sorterElementService.addElementToSorter(sorterId, elementId);
            return ResponseEntity.ok("요소가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("요소 추가 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 정렬자에서 요소 제거
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeElementFromSorter(
        @RequestParam int sorterId,
        @RequestParam int elementId
    ) {
        try {
            sorterElementService.removeElementFromSorter(sorterId, elementId);
            return ResponseEntity.ok("요소가 성공적으로 제거되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("요소 제거 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
