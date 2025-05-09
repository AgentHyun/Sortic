package org.sortic.sorticproject.Entity;

import lombok.Data;

@Data
public class BillElementDetail {
    private int elementsNameId;
    private String elementsName;
    private int elementsPrice;
    private int elementCount;
}
