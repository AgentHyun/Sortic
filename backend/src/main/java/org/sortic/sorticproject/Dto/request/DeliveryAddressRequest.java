package org.sortic.sorticproject.Dto.request;

import lombok.Getter;

@Getter
public class DeliveryAddressRequest {
    private String receiverName;
    private String phone;
    private String address;
    private String detailAddress;
    private String postcode;
    private boolean isDefault;
}
