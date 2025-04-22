package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.Element;
import org.sortic.sorticproject.Entity.Sorter;
import org.sortic.sorticproject.Service.SorterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sorter")
public class SorterController {

    @Autowired
    private SorterService sorterService;

    @PostMapping("/add")
    public ResponseEntity<Sorter> addSorter(@RequestBody Sorter sorter) {
        sorterService.addSorter(sorter);
        return ResponseEntity.ok(sorter);
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteSorter(@RequestBody Map<String, Integer> payload) {
        int sorterId = payload.get("sorter_id");
        sorterService.deleteSorter(sorterId);
        return ResponseEntity.ok("삭제 완료");
    }

    @PostMapping("/reorder")
    public ResponseEntity<List<Sorter>> reorderSorters(@RequestBody List<Sorter> sorters) {
        List<Sorter> reordered = sorterService.reorderSorterNumbers(sorters);
        return ResponseEntity.ok(reordered);
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<List<Sorter>> getUserSorters(@PathVariable("user_id") String userId) {
        // 중복된 sorter_name만 하나씩 반환하는 서비스 호출
        List<Sorter> uniqueSorters = sorterService.getUniqueSortersByUserId(userId);
        return ResponseEntity.ok(uniqueSorters);
    }
    @PutMapping("/update")
    public ResponseEntity<Void> updateSorterName(@RequestBody Map<String, String> payload) {
        String oldSorterName = payload.get("oldSorterName");
        String sorterName = payload.get("sorterName");

        // sorter_name을 업데이트
        sorterService.updateSorterName(oldSorterName, sorterName);
        return ResponseEntity.noContent().build();  // No Content 상태로 반환
    }


    @PostMapping("/delete/multiple")
    public ResponseEntity<String> deleteMultipleSorters(@RequestBody List<Integer> sorterIds) {
        sorterService.deleteMultipleSorters(sorterIds);
        return ResponseEntity.ok("다중 삭제 완료");
    }

    @PutMapping("/update-elements")
    public ResponseEntity<Sorter> updateElementsId(@RequestBody Map<String, Integer> payload) {
        int sorterId = payload.get("sorter_id");
        int elementsId = payload.get("elements_id");

        Sorter updatedSorter = sorterService.updateElementsId(sorterId, elementsId);
        return ResponseEntity.ok(updatedSorter);
    }
    @GetMapping("/elements/{sorter_id}")
    public ResponseEntity<Integer> getElementsIdBySorterId(@PathVariable int sorter_id) {
        Integer elementsId = sorterService.getElementsIdBySorterId(sorter_id);
        return ResponseEntity.ok(elementsId);
    }
    @GetMapping("/name/{sorter_id}")
    public ResponseEntity<String> getSorterNameById(@PathVariable int sorter_id) {
        String sorterName = sorterService.getSorterNameById(sorter_id);
        return ResponseEntity.ok(sorterName);
    }
    @GetMapping("/element-id/{sorter_name}")
    public ResponseEntity<List<Integer>> getElementsIdBySorterName(@PathVariable String sorter_name) {
        List<Integer> elementsIds = sorterService.getElementsIdBySorterName(sorter_name);
        return ResponseEntity.ok(elementsIds);
    }




    // 특정 정렬자에 요소 추가
    @PostMapping("/name/{sorterName}/addElement")
    public ResponseEntity<Sorter> addElementToSorter(@PathVariable String sorterName,
                                                     @RequestBody Sorter newSorter) {
        // sorter_name을 newSorter에 설정
        newSorter.setSorter_name(sorterName);

        // 서비스 메서드 호출
        Sorter addedSorter = sorterService.addElementToSorter(newSorter);

        // 새로 추가된 정렬자 반환
        return ResponseEntity.ok(addedSorter);
    }

    @GetMapping("/{sorterId}/elements/{elementsId}")
    public ResponseEntity<Map<String, Boolean>> checkElementExistsInSorter(
        @PathVariable int sorterId,
        @PathVariable int elementsId) {
        boolean exists = sorterService.doesElementExistInSorter(sorterId, elementsId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

}
