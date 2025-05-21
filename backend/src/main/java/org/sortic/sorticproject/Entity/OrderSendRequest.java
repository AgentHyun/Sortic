package org.sortic.sorticproject.Entity;

import lombok.Data;

import java.util.List;

@Data
public class OrderSendRequest {
    private String orderUserId;
    private int billId;
    private int wholesaleLinkId;
    private List<OrderElement> elements;

//    orderUserId: user.userId,
//    wholesaleLinkId: wholesaleLinkId,
//    elements: bill.elements.map(el => ({
//        elementName: el.elementsName,
//            elementPrice: el.elementsPrice,
//            elementCount: el.elementCount
}
