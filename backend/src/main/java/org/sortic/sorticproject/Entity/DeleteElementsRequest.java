package org.sortic.sorticproject.Entity;

import java.util.List;

public class DeleteElementsRequest {
    private String sorterName;
    private List<Integer> elementIds;

    // Getters and Setters
    public String getSorterName() {
        return sorterName;
    }

    public void setSorterName(String sorterName) {
        this.sorterName = sorterName;
    }

    public List<Integer> getElementIds() {
        return elementIds;
    }

    public void setElementIds(List<Integer> elementIds) {
        this.elementIds = elementIds;
    }
}
