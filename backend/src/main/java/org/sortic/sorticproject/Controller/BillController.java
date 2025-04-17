package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.BillGroupResponse;
import org.sortic.sorticproject.Service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

}
