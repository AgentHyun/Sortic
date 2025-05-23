package org.sortic.sorticproject.Entity;

import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
        private int orderId;
        private String status;
}
