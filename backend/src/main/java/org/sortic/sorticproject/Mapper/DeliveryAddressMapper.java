package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.DeliveryAddress;

import java.util.List;

@Mapper
public interface DeliveryAddressMapper {

    /**
     * 배송지 등록
     */
    @Insert("""
        INSERT INTO Delivery_Address (
            user_id, recipient_name, phone_number, postal_code,
            address1, address2, is_default
        ) VALUES (
            #{userId}, #{recipientName}, #{phoneNumber}, #{postalCode},
            #{address1}, #{address2}, #{isDefault}
        )
    """)
    void insertAddress(DeliveryAddress address);

    /**
     * 유저의 배송지 목록 조회
     */
    @Select("SELECT * FROM Delivery_Address WHERE user_id = #{userId} ORDER BY is_default DESC, created_at ASC")
    List<DeliveryAddress> findAddressesByUserId(@Param("userId") String userId);

    /**
     * 배송지 삭제
     */
    @Delete("DELETE FROM Delivery_Address WHERE delivery_address_id = #{addressId}")
    void deleteAddressById(@Param("addressId") int addressId);

    /**
     * 유저의 모든 배송지를 기본 아님으로 초기화
     */
    @Update("UPDATE Delivery_Address SET is_default = FALSE WHERE user_id = #{userId}")
    void clearDefaultAddress(@Param("userId") String userId);

    /**
     * 특정 배송지를 기본 배송지로 설정
     */
    @Update("UPDATE Delivery_Address SET is_default = TRUE WHERE delivery_address_id = #{addressId}")
    void setDefaultAddress(@Param("addressId") int addressId);
}
