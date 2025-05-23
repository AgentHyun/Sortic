package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.BillOrderElementDetail;
import org.sortic.sorticproject.Entity.BillOrderGroupResponse;

import java.util.List;

@Mapper
public interface OrderMapper {


    // 1. 주문 테이블 insert
    @Insert("INSERT INTO Bill_Order (order_user_id,bill_id, wholesale_user_id, wholesale_commission) " +
        "VALUES (#{orderUserId},#{billId}, #{wholesaleUserId}, #{commission})")
    void insertOrder(@Param("orderUserId") String orderUserId,
                     @Param("billId") int billId,
                     @Param("wholesaleUserId") String wholesaleUserId,
                     @Param("commission") int commission);

    // 2. 마지막으로 insert된 order_id 조회
    @Select("SELECT LAST_INSERT_ID()")
    int getLastInsertId();

    // 3. 주문 요소 insert
    @Insert("INSERT INTO Bill_Order_Element (order_id, element_name, element_price, element_count) " +
        "VALUES (#{orderId}, #{elementName}, #{elementPrice}, #{elementCount})")
    void insertOrderElement(@Param("orderId") int orderId,
                            @Param("elementName") String elementName,
                            @Param("elementPrice") int elementPrice,
                            @Param("elementCount") int elementCount);

    @Select("""
    SELECT order_status FROM Bill_Order
    WHERE bill_id = #{billId}
    ORDER BY order_time DESC
    LIMIT 1
    """)            // Order By ~~~~ Limit 1 으로 인해 가장 최근 주문 1건의 상태를 가져옴
    String findLatestStatusByBillId(@Param("billId") int billId);


    @Select("""
    SELECT
      order_id AS orderId,
      bill_id AS billId,
      order_user_id AS orderUserId,
      order_status AS orderStatus,
      DATE_FORMAT(order_time, '%Y-%m-%d %H:%i:%s') AS orderTime,
      wholesale_commission AS wholesaleCommission
    FROM Bill_Order
    WHERE wholesale_user_id = #{userId}
    ORDER BY order_time DESC
""")
    List<BillOrderGroupResponse> getOrdersByWholesaleUserId(String userId);


    @Select("""
    SELECT
      element_name AS elementName,
      element_price AS elementPrice,
      element_count AS elementCount
    FROM Bill_Order_Element
    WHERE order_id = #{orderId}
""")
    List<BillOrderElementDetail> getElementsByOrderId(int orderId);

    @Update("""
        UPDATE Bill_Order
        SET order_status = #{status}
        WHERE order_id = #{orderId}
    """)
    int updateOrderStatus(@Param("orderId") int orderId, @Param("status") String status);
    }
