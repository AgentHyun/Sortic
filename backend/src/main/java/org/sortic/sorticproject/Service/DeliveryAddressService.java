package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.sortic.sorticproject.Entity.DeliveryAddress;
import org.sortic.sorticproject.Mapper.DeliveryAddressMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeliveryAddressService {

    private final DeliveryAddressMapper deliveryAddressMapper;

    /**
     * 배송지 등록
     */
    public void addAddress(DeliveryAddress deliveryAddress) {
        deliveryAddressMapper.insertAddress(deliveryAddress);
    }

    /**
     * 유저의 배송지 목록 조회
     */
    public List<DeliveryAddress> getAddressList(String userId) {
        return deliveryAddressMapper.findAddressesByUserId(userId);
    }

    /**
     * 배송지 삭제
     */
    public void deleteAddress(int addressId) {
        deliveryAddressMapper.deleteAddressById(addressId);
    }

    /**
     * 기본 배송지 설정
     * 다른 배송지는 모두 is_default = false 처리 후 해당 주소를 true로 설정
     */
    @Transactional
    public void setDefaultAddress(String userId, int addressId) {
        deliveryAddressMapper.clearDefaultAddress(userId); // 기존 기본 배송지 초기화
        deliveryAddressMapper.setDefaultAddress(addressId); // 새 기본 배송지 설정
    }
}
