package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.Bill;
import org.sortic.sorticproject.Entity.BillCommissionDetail;
import org.sortic.sorticproject.Entity.BillGroupResponse;
import org.sortic.sorticproject.Service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PutMapping("/updateBillName")
    private void updateBillName (@RequestBody Bill bill){
        billService.updateBillName(bill.getBillId(),bill.getBillName());
    }

    @PostMapping("/addBillCommission")
    public void addBillCommission(@RequestBody Map<String,Object>data) {
        int billId = (int) data.get("billId");
        String commissionName = (String) data.get("commissionName");
        int commission = (int) data.get("commission");
        billService.addCommission(billId,commissionName,commission);
    }

}
