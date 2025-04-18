package org.sortic.sorticproject.Entity;

import lombok.Data;

import java.util.List;

@Data
public class BillGroupResponse {
    private int billId;
    private String billName;
    private List<BillElementDetail> elements;
    private List<BillCommissionDetail> commissions;
    private int totalElementPrice;
    private int totalCommission;
    private int grandTotal;


}
