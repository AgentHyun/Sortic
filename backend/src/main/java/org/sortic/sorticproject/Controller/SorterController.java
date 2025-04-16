package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.Sorter;
import org.sortic.sorticproject.Service.SorterService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<List<Sorter>> getUserSorters(@PathVariable String user_id) {
        return ResponseEntity.ok(sorterService.getSortersByUserId(user_id));
    }

    @PutMapping("/update-name")
    public ResponseEntity<Sorter> updateSorterName(@RequestBody Map<String, Object> payload) {
        int sorterId = (int) payload.get("sorter_id");
        String sorterName = (String) payload.get("sorter_name");

        Sorter updatedSorter = sorterService.updateSorterName(sorterId, sorterName);
        return ResponseEntity.ok(updatedSorter);
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



}