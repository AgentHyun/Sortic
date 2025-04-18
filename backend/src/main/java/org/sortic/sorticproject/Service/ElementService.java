package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.Element;
import org.sortic.sorticproject.Mapper.ElementMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ElementService {

    @Autowired
    private ElementMapper elementMapper;

    // 상품 추가
    public void addElement(Element element) {
        elementMapper.insertElement(element);
    }

    // 상품 조회
    public Element getElementById(int elements_name_id) {
        return elementMapper.getElementById(elements_name_id);
    }



    // 카테고리별 상품 목록 조회
    public List<Element> getElementsByCategoryId(int category_id) {
        return elementMapper.getElementsByCategoryId(category_id);
    }

    // 상품 수정
    public void updateElement(int elements_name_id, String elements_name ) {
        elementMapper.updateElement(elements_name_id, elements_name);
    }
    // 상품 가격 수정
    public void updateElementPrice(int elements_name_id, int elements_price ) {
        elementMapper.updateElementPrice(elements_name_id, elements_price);
    }

    // 상품 삭제
    public void deleteElement(int elements_name_id) {
        elementMapper.deleteElement(elements_name_id);
    }
    // 다중 삭제 메서드 추가
    public void deleteElementsByIds(List<Integer> ids) {
        elementMapper.deleteElementsByIds(ids);
    }
    public String getElementNameById(int elementsId) {
        Element element = elementMapper.getElementById(elementsId);  // ElementMapper 사용하여 조회
        return element != null ? element.getElements_name() : null;  // 요소가 존재하면 이름 반환, 없으면 null 반환
    }
    public Integer getElementPriceById(int elements_name_id) {
        // 가격만 반환하도록 수정
        return elementMapper.getElementPriceById(elements_name_id);
    }
}
