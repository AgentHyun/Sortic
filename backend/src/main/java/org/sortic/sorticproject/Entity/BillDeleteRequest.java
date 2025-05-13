package org.sortic.sorticproject.Entity;

import lombok.Data;

import java.util.List;

@Data
public class BillDeleteRequest {
    private int billId;
    private List<Integer> commissionIds;
}
