package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.*;
import org.sortic.sorticproject.Mapper.BillMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BillService {
    @Autowired
    private BillMapper billMapper;
    // Bill 추가
    public void addBill(Bill bill) {
        billMapper.insertBill(bill);
    }
    // Bill 삭제
    public void deleteBill(int billId) {
        billMapper.deleteBillById(billId);
    }
    // billName 수정
    public void updateBillName(int billId, String billName){
        billMapper.updateBillName(billId,billName);
    }
    // Bill 전체 불러오기
    public List<BillGroupResponse> getBillDetails(String userId){
        // 1. 해당 유저의 Bill 목록 가져오기
        List<Bill> billList = billMapper.findBillsByUserId(userId);

        // 최종 결과 리스트
        List<BillGroupResponse> resultList = new ArrayList<>();

        // 2. 계산서 하나씩 처리
        for (Bill bill : billList) {
            int billId = bill.getBillId();
            String billName = bill.getBillName();
            // 3. Element 목록 가져오기
            List<BillElementDetail> elements = billMapper.findElementsByBillId(billId);
            // 4. Commission 목록 가져오기
            List<BillCommissionDetail> commissions = billMapper.findCommissionsByBillId(billId);

            // 5. 요소 가격 총합 계산
            int totalElementPrice = 0;
            for (BillElementDetail el : elements) {
                totalElementPrice += el.getElementsPrice();
            }
            // 6. 수수료 가격 총합
            int totalCommission = 0;
            for (BillCommissionDetail com : commissions){
                totalCommission += com.getCommission();
            }
            // 7 총합
            int grandTotal = totalCommission + totalElementPrice;

            // 8. 최종 계산서 구성하기
            BillGroupResponse response = new BillGroupResponse();
            response.setBillId(billId);
            response.setBillName(billName);
            response.setElements(elements);
            response.setCommissions(commissions);
            response.setTotalElementPrice(totalElementPrice);
            response.setTotalCommission(totalCommission);
            response.setGrandTotal(grandTotal);

            // 9. 결과 리스트에 추가
            resultList.add(response);
        }
        return resultList;
    }
    public List<BillElementsData> getElementsDataByNameId(int elementsNameId) {
        return billMapper.getElementsDataByNameId(elementsNameId);
    }

    public void increaseElementCount(int billId, int elementsNameId) {
        billMapper.increaseElementCount(billId, elementsNameId);
    }

    public void decreaseElementCount(int billId, int elementsNameId) {
        billMapper.decreaseElementCount(billId, elementsNameId);
    }

    public void deleteElementFromBill(int billId, int elementsNameId) {
        billMapper.deleteElementFromBill(billId, elementsNameId);
    }
}
