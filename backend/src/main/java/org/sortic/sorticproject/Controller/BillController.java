package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.*;
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
    public List<BillGroupResponse> getbills(@RequestParam String userId, @RequestParam String wholesaleLinkId){
        return billService.getBillDetails(userId,wholesaleLinkId);
    }

    @PostMapping("/addBill")
    public void addBill(@RequestBody Bill bill) {
        billService.addBill(bill);
    }

    @DeleteMapping("/deleteBill")
    public void deleteBill(@RequestParam int billId) {
        billService.deleteBill(billId);
    }

    @PutMapping("/updateBillName")
    private void updateBillName (@RequestBody Bill bill){
        billService.updateBillName(bill.getBillId(),bill.getBillName());
    }
    @GetMapping("/getElementsdata")
    public List<BillElementsData> getElementsData(@RequestParam int elementsNameId) {
        return billService.getElementsDataByNameId(elementsNameId);
    }

    @PutMapping("/increaseCount")
    public void increaseElementCount(@RequestParam int billId, @RequestParam int elementsNameId) {
        billService.increaseElementCount(billId, elementsNameId);
    }

    @PutMapping("/decreaseCount")
    public void decreaseElementCount(@RequestParam int billId, @RequestParam int elementsNameId) {
        billService.decreaseElementCount(billId, elementsNameId);
    }


    @DeleteMapping("/deleteElement")
    public ResponseEntity<Void> deleteElement(@RequestParam int billId, @RequestParam int elementsNameId) {
        billService.deleteElementFromBill(billId, elementsNameId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/addCommission")
    public void addCommission(@RequestBody BillCommissionDetail commission) {
        billService.addCommission(commission);
    }

    @DeleteMapping("/deleteSelectedCommissions")
    public void deleteSelectedCommissions(@RequestBody BillDeleteRequest deleteRequest) {
    billService.deleteSelectedCommissions(deleteRequest.getBillId(),deleteRequest.getCommissionIds());
    }


}
