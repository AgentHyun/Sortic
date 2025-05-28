// src/main/java/org/sortic/sorticproject/Entity/DeliveryAddress.java

package org.sortic.sorticproject.Entity;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class DeliveryAddress {
    private int deliveryAddressId; // 배송지 고유 ID
    private String userId;         // 소매업자 ID
    private String recipientName;  // 수령인 이름
    private String phoneNumber;    // 수령인 전화번호
    private String postalCode;     // 우편번호
    private String address1;       // 기본 주소
    private String address2;       // 상세 주소
    private boolean isDefault;     // 기본 배송지 여부
    private Timestamp createdAt;   // 등록 시간
    private Timestamp updatedAt;   // 수정 시간
}
