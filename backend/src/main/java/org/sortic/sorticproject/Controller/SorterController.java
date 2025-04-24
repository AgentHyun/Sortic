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
        // 요청 받은 payload 로그
        System.out.println("서버에서 받은 payload: " + payload);

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
        List<Sorter> uniqueSorters = sorterService.getUniqueSortersByUserId(userId);
        return ResponseEntity.ok(uniqueSorters);
    }

    @PutMapping("/update")
    public ResponseEntity<List<Sorter>> updateSorterName(@RequestBody Map<String, String> payload) {
        String oldSorterName = payload.get("oldSorterName");
        String sorterName = payload.get("sorterName");

        List<Sorter> updatedSorters = sorterService.updateSorterName(oldSorterName, sorterName);

        if (updatedSorters.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedSorters);
    }
    @PostMapping("/delete/multiple")
    public ResponseEntity<String> deleteMultipleSorters(@RequestBody List<Integer> sorterIds) {
        try {
            sorterService.deleteMultipleSorters(sorterIds);
            return ResponseEntity.ok("정렬자들이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패");
        }
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

    @PostMapping("/name/{sorterName}/addElement")
    public ResponseEntity<Sorter> addElementToSorter(@PathVariable String sorterName,
                                                     @RequestBody Element element) {
        Sorter addedSorter = sorterService.addElementToSorter(sorterName, element);
        return ResponseEntity.ok(addedSorter);
    }

    @GetMapping("/{sorterName}/elements/{elementsId}")
    public ResponseEntity<Map<String, Boolean>> checkElementExistsInSorterByName(
        @PathVariable String sorterName,
        @PathVariable int elementsId) {
        boolean exists = sorterService.doesElementExistInSorterByName(sorterName, elementsId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/get-sorter-id")
    public ResponseEntity<Integer> getSorterIdByNameAndElementId(
        @RequestParam String sorterName,
        @RequestParam int elementsId) {

        Integer sorterId = sorterService.getSorterIdByNameAndElementId(sorterName, elementsId);

        if (sorterId != null) {
            return ResponseEntity.ok(sorterId);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
