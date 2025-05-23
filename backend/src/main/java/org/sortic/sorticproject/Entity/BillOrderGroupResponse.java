package org.sortic.sorticproject.Entity;

import lombok.Data;

import java.util.List;

@Data
public class BillOrderGroupResponse {
    private int orderId;
    private int billId;
    private String orderUserId;
    private String orderStatus;
    private String orderTime; // or LocalDateTime
    private int wholesaleCommission;
    private List<BillOrderElementDetail> elements;
}
