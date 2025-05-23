package org.sortic.sorticproject.Entity;

import lombok.Data;

@Data
public class BillOrderElementDetail {
    private String elementName;
    private int elementPrice;
    private int elementCount;
}
