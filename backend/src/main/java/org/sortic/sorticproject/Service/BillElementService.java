package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.BillElement;
import org.sortic.sorticproject.Mapper.BillElementMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillElementService {
    @Autowired
    private BillElementMapper billElementMapper;

    // BillElement 추가
    public void addBillElement(BillElement billElement) {
        billElementMapper.insertBillElement(billElement);
    }

    // BillElement 삭제
    public void deleteBillElement(int billElementId) {
        billElementMapper.deleteBillElementById(billElementId);
    }

    // BillElement 수정 (요소 변경)
    public void updateBillElement(BillElement billElement) {
        billElementMapper.updateBillElement(billElement);
    }

    // 특정 Bill에 대한 모든 BillElement 가져오기
    public List<BillElement> getBillElementsByBillId(int billId) {
        return billElementMapper.findBillElementsByBillId(billId);
    }

    // 특정 Element에 대한 BillElement 가져오기
    public List<BillElement> getBillElementsByElementId(int elementsNameId) {
        return billElementMapper.findBillElementsByElementId(elementsNameId);
    }
}
