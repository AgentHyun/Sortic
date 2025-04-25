package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Service.SorterElementService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Integer> getElementIdsBySorterId(@PathVariable int sorterId) {
        return sorterElementService.getElementIdsBySorterId(sorterId);
    }

    // 특정 Element ID로 요소 이름 가져오기
    @GetMapping("/element/{elementId}/name")
    public String getElementNameById(@PathVariable int elementId) {
        return sorterElementService.getElementNameById(elementId);
    }

    // 정렬자에 요소 추가
    @PostMapping("/add")
    public void addElementToSorter(
        @RequestParam int sorterId,
        @RequestParam int elementId
    ) {
        sorterElementService.addElementToSorter(sorterId, elementId);
    }

    // 정렬자에서 요소 제거
    @DeleteMapping("/remove")
    public void removeElementFromSorter(
        @RequestParam int sorterId,
        @RequestParam int elementId
    ) {
        sorterElementService.removeElementFromSorter(sorterId, elementId);
    }
}
