package org.sortic.sorticproject.Entity;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class BillElement {
    private int billElementId;     // Bill_Element 기본키
    private int billId;            // Bill_id (외래키)
    private int elementsNameId;    // Elements_name_id (외래키)
    private Timestamp createTime;  // 생성 시간
}
