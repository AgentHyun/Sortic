package org.sortic.sorticproject.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.sortic.sorticproject.Entity.DeliveryAddress;
import org.sortic.sorticproject.Service.DeliveryAddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/delivery")
public class DeliveryAddressController {

    private final DeliveryAddressService deliveryAddressService;

    /**
     * 배송지 등록
     */
    @PostMapping("/add")
    public ResponseEntity<?> addAddress(@RequestBody DeliveryAddress deliveryAddress) {
        try {
            deliveryAddressService.addAddress(deliveryAddress);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("🚨 배송지 등록 실패", e);
            return ResponseEntity.badRequest().body("배송지 등록 실패: " + e.getMessage());
        }
    }

    /**
     * 특정 유저의 배송지 목록 조회
     */
    @GetMapping("/list")
    public ResponseEntity<List<DeliveryAddress>> getAddressList(@RequestParam("userId") String userId) {
        try {
            List<DeliveryAddress> list = deliveryAddressService.getAddressList(userId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            log.error("🚨 배송지 목록 조회 실패", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 배송지 삭제
     */
    @DeleteMapping("/delete/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable("addressId") int addressId) {
        try {
            deliveryAddressService.deleteAddress(addressId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("🚨 배송지 삭제 실패", e);
            return ResponseEntity.badRequest().body("배송지 삭제 실패: " + e.getMessage());
        }
    }

    /**
     * 기본 배송지 설정
     */
    @PutMapping("/set-default")
    public ResponseEntity<?> setDefaultAddress(@RequestParam("userId") String userId,
                                               @RequestParam("addressId") int addressId) {
        try {
            deliveryAddressService.setDefaultAddress(userId, addressId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("🚨 기본 배송지 설정 실패", e);
            return ResponseEntity.badRequest().body("기본 배송지 설정 실패: " + e.getMessage());
        }
    }
}
