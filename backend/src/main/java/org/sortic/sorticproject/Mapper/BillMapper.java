package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.Bill;
import org.sortic.sorticproject.Entity.BillCommissionDetail;
import org.sortic.sorticproject.Entity.BillElementDetail;
import org.sortic.sorticproject.Entity.BillElementsData;

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
    SELECT en.elements_name_id, en.elements_name, en.elements_price,be.element_count
    FROM Bill_Element be
    JOIN Elements_name en ON be.elements_name_id = en.elements_name_id
    WHERE be.Bill_id = #{billId}
""")
    @Results(id = "BillElementDetailMap", value = {
        @Result(property = "elementCount",column = "element_count"),
        @Result(property = "elementsNameId", column = "elements_name_id"),
        @Result(property = "elementsName", column = "elements_name"),
        @Result(property = "elementsPrice", column = "elements_price")
    })
    List<BillElementDetail> findElementsByBillId(@Param("billId") int billId);




    @Select("""
        SELECT bill_commission_id AS billCommissionId , commission_name AS commissionName, commission
        FROM Bill_Commission
        WHERE Bill_id = #{billId}
    """)
    List<BillCommissionDetail> findCommissionsByBillId(@Param("billId") int billId);

    @Update("UPDATE Bill SET bill_name = #{billName} WHERE bill_id = ${billId}")
    void updateBillName(@Param("billId")int billId,@Param("billName") String billName);

    @Select("SELECT * FROM elements_data WHERE elements_name_id = #{elementsNameId}")
    @Results({
        @Result(property = "elementsId", column = "elements_id"),
        @Result(property = "elementsNameId", column = "elements_name_id"),
        @Result(property = "keyName", column = "key_name"),
        @Result(property = "valueName", column = "value_name")
    })
    List<BillElementsData> getElementsDataByNameId(@Param("elementsNameId") int elementsNameId);


    @Update("""
        UPDATE Bill_Element
        SET element_count = element_count + 1
        WHERE bill_id = #{billId} AND elements_name_id = #{elementsNameId}
    """)
    void increaseElementCount(@Param("billId") int billId, @Param("elementsNameId") int elementsNameId);

    @Update("""
        UPDATE Bill_Element
        SET element_count = element_count - 1
        WHERE bill_id = #{billId} AND elements_name_id = #{elementsNameId} AND element_count > 1
    """)
    void decreaseElementCount(@Param("billId") int billId, @Param("elementsNameId") int elementsNameId);

    @Delete("DELETE FROM Bill_Element WHERE bill_id = #{billId} AND elements_name_id = #{elementsNameId}")
    void deleteElementFromBill(@Param("billId") int billId, @Param("elementsNameId") int elementsNameId);

    @Insert("""
    insert into bill_commission (bill_id,commission_name,commission) values (#{billId},#{commissionName},#{commission})
""")void insertCommission (BillCommissionDetail commission);

    @Delete({
        "<script>",
        "DELETE FROM bill_commission",
        "WHERE bill_id = #{billId}",
        "AND bill_commission_id IN",
        "<foreach item='id' collection='commissionIds' open='(' separator=',' close=')'>",
        "#{id}",
        "</foreach>",
        "</script>"
    })
    void deleteSelectedCommissions(@Param("billId") int billId, @Param("commissionIds") List<Integer> commissionIds);
}
