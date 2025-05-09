package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.Bill;
import org.sortic.sorticproject.Entity.BillCommissionDetail;
import org.sortic.sorticproject.Entity.BillGroupResponse;
import org.sortic.sorticproject.Service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
public class BillController {
    @Autowired
    private BillService billService;

    @GetMapping("/getAllBills")
    public ResponseEntity<?> getbills(@RequestParam(required = false) String userId) {
        try {
            if (userId == null || userId.equals("undefined")) {
                return ResponseEntity.badRequest().body("사용자 ID가 필요합니다.");
            }
            List<BillGroupResponse> bills = billService.getBillDetails(userId);
            return ResponseEntity.ok(bills);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("청구서 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/addBill")
    public ResponseEntity<?> addBill(@RequestBody Bill bill) {
        try {
            billService.addBill(bill);
            return ResponseEntity.ok("청구서가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("청구서 추가 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteBill")
    public ResponseEntity<?> deleteBill(@RequestParam int billId) {
        try {
            billService.deleteBill(billId);
            return ResponseEntity.ok("청구서가 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("청구서 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PutMapping("/updateBillName")
    public ResponseEntity<?> updateBillName(@RequestBody Bill bill) {
        try {
            billService.updateBillName(bill.getBillId(), bill.getBillName());
            return ResponseEntity.ok("청구서 이름이 성공적으로 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("청구서 이름 업데이트 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
