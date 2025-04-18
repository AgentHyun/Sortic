package org.sortic.sorticproject.Entity;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class Bill {
    private int billId;
    private String userId;
    private String billName;
    private Timestamp createBillTime;
}
