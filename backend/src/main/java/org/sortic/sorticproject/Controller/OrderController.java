                                           package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.OrderSendRequest;
import org.sortic.sorticproject.Mapper.OrderMapper;
import org.sortic.sorticproject.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
