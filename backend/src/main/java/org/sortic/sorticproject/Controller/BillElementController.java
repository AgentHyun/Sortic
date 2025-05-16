package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.BillElement;
import org.sortic.sorticproject.Service.BillElementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bill-elements")
public class BillElementController {

    @Autowired
    private BillElementService billElementService;

    // Bill_Element에 요소 추가하기
    @PostMapping("/add")
    public ResponseEntity<String> addBillElement(@RequestBody BillElement billElement) {
        try {
            billElementService.addBillElement(billElement);
            return ResponseEntity.ok("요소가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("요소 추가 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    @PostMapping("/add-multiple")
    public ResponseEntity<String> addMultipleBillElements(@RequestBody List<BillElement> billElements) {
        try {
            billElementService.addMultipleBillElements(billElements);
            return ResponseEntity.ok("여러 요소가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("여러 요소 추가 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    // Bill_Element 삭제하기
    @DeleteMapping("/delete/{billElementId}")
    public ResponseEntity<String> deleteBillElement(@PathVariable int billElementId) {
        try {
            billElementService.deleteBillElement(billElementId);
            return ResponseEntity.ok("요소가 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("요소 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // Bill_Element 수정하기
    @PutMapping("/update")
    public ResponseEntity<String> updateBillElement(@RequestBody BillElement billElement) {
        try {
            billElementService.updateBillElement(billElement);
            return ResponseEntity.ok("요소가 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("요소 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 특정 Bill에 대한 모든 BillElement 조회하기
    @GetMapping("/bill/{billId}")
    public ResponseEntity<List<BillElement>> getBillElementsByBillId(@PathVariable int billId) {
        try {
            List<BillElement> billElements = billElementService.getBillElementsByBillId(billId);
            return ResponseEntity.ok(billElements);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // 특정 Element에 대한 모든 BillElement 조회하기
    @GetMapping("/element/{elementId}")
    public ResponseEntity<List<BillElement>> getBillElementsByElementId(@PathVariable int elementId) {
        try {
            List<BillElement> billElements = billElementService.getBillElementsByElementId(elementId);
            return ResponseEntity.ok(billElements);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
