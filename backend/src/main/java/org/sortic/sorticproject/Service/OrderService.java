package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.BillOrderElementDetail;
import org.sortic.sorticproject.Entity.BillOrderGroupResponse;
import org.sortic.sorticproject.Entity.OrderElement;
import org.sortic.sorticproject.Entity.OrderSendRequest;
import org.sortic.sorticproject.Mapper.OrderMapper;
import org.sortic.sorticproject.Mapper.WholesaleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class OrderService {
    @Autowired
    WholesaleMapper wholesaleMapper;

    @Autowired
    OrderMapper orderMapper;

    @Transactional
    public void sendOrder(OrderSendRequest orderSendRequest) {
        // 1. 도매 링크로 도매업자 ID와 수수료 조회
        Map<String, Object> info = wholesaleMapper.findUserIdAndWholesaleCommissionByWholesaleLinkId(orderSendRequest.getWholesaleLinkId());

        String wholesaleUserId = (String) info.get("wholesale_name");
        int wholesaleCommission = ((Number) info.get("wholesale_commission")).intValue();

        // 2. 주문 테이블 insert
        orderMapper.insertOrder(orderSendRequest.getOrderUserId(),orderSendRequest.getBillId(), wholesaleUserId, wholesaleCommission);

        // 3. 생성된 주문 ID 조회
        int orderId = orderMapper.getLastInsertId();

        // 4. 주문 요소들 insert
        for (OrderElement el : orderSendRequest.getElements()) {
            orderMapper.insertOrderElement(
                orderId,
                el.getElementName(),
                el.getElementPrice(),
                el.getElementCount()
            );
        }
    }
    public List<BillOrderGroupResponse> getGroupedOrdersByWholesaleUserId(String userId) {
        List<BillOrderGroupResponse> orders = orderMapper.getOrdersByWholesaleUserId(userId);

        for (BillOrderGroupResponse order : orders) {
            if (order == null) {
                System.out.println("⚠️ order is null");
                continue;
            }
            System.out.println("👉 orderId: " + order.getOrderId()); // 디버깅용
            List<BillOrderElementDetail> elements =
                orderMapper.getElementsByOrderId(order.getOrderId());
            order.setElements(elements);
        }

        return orders;
    }
    public boolean updateOrderStatus(int orderId, String status) {
        return orderMapper.updateOrderStatus(orderId, status) > 0;
    }

}
