                                           package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.BillOrderGroupResponse;
import org.sortic.sorticproject.Entity.OrderSendRequest;
import org.sortic.sorticproject.Entity.OrderStatusUpdateRequest;
import org.sortic.sorticproject.Mapper.OrderMapper;
import org.sortic.sorticproject.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

                                           @RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderMapper orderMapper;

    @PostMapping("/sendOrder")
    public void sendOrder(@RequestBody OrderSendRequest orderSendRequest) {
        orderService.sendOrder(orderSendRequest);
    }
    @GetMapping("/checkStatus")
    public ResponseEntity<?> checkOrderStatus(@RequestParam int billId) {
        String status = orderMapper.findLatestStatusByBillId(billId);
        return ResponseEntity.ok(status); // null이면 주문한 적 없음
    }

    @GetMapping("/received")
    public ResponseEntity<?> getOrdersByWholesaleUser(@RequestParam String userId) {
        List<BillOrderGroupResponse> orders = orderService.getGroupedOrdersByWholesaleUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/update-status")
    public ResponseEntity<?> updateOrderStatus(@RequestBody OrderStatusUpdateRequest request) {
        boolean updated = orderService.updateOrderStatus(request.getOrderId(), request.getStatus());
        if (updated) {
            return ResponseEntity.ok("상태 변경 완료");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 주문이 존재하지 않음");
        }
    }

}
