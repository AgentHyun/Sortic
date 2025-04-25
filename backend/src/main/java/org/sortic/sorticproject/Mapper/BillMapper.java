package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.Bill;
import org.sortic.sorticproject.Entity.BillCommissionDetail;
import org.sortic.sorticproject.Entity.BillElementDetail;

import java.util.List;

@Mapper
public interface BillMapper {

    @Insert("insert into bill (user_id,bill_name) values (#{userId},#{billName})")
    void insertBill(Bill bill);

    @Delete("DELETE FROM bill WHERE bill_id = #{billId}")
    void deleteBillById(int billId);

    @Select("Select * from Bill Where user_id = #{userId}")
    @Results(id = "BillMap", value = {
        @Result(property = "billId", column = "bill_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "billName", column = "bill_name"),
        @Result(property = "createBillTime", column = "created_bill_time")
    })
    List<Bill> findBillsByUserId(@Param("userId") String userId);

    @Select("""
        SELECT en.elements_name, en.elements_price
        FROM Bill_Element be
        JOIN Elements_name en ON be.elements_name_id = en.elements_name_id
        WHERE be.Bill_id = #{billId}
    """)
    @Results(id = "BillElementDetailMap", value = {
        @Result(property = "elementsName", column = "elements_name"),
        @Result(property = "elementsPrice", column = "elements_price")
    })
    List<BillElementDetail> findElementsByBillId(@Param("billId") int billId);


    @Select("""
        SELECT commission_named AS commissionName, commission
        FROM Bill_Commission
        WHERE Bill_id = #{billId}
    """)
    List<BillCommissionDetail> findCommissionsByBillId(@Param("billId") int billId);

    @Update("UPDATE Bill SET bill_name = #{billName} WHERE bill_id = ${billId}")
    void updateBillName(@Param("billId")int billId,@Param("billName") String billName);


}
