package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.Bill;
import org.sortic.sorticproject.Entity.BillGroupResponse;
import org.sortic.sorticproject.Service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {
    @Autowired
    private BillService billService;

    @GetMapping("/getAllBills")
    public List<BillGroupResponse> getbills(@RequestParam String userId){
        return billService.getBillDetails(userId);
    }

    @PostMapping("/addBill")
    public void addBill(@RequestBody Bill bill) {
        billService.addBill(bill);
    }

    @DeleteMapping("/deleteBill")
    public void deleteBill(@RequestParam int billId) {
        billService.deleteBill(billId);
    }

}
