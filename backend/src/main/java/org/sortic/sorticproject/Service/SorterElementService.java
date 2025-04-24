package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.SorterElement;
import org.sortic.sorticproject.Mapper.ElementMapper;
import org.sortic.sorticproject.Mapper.SorterElementMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SorterElementService {

    @Autowired
    private SorterElementMapper sorterElementMapper;

    @Autowired
    private ElementMapper elementMapper;

    /**
     * 특정 정렬자에 연결된 모든 SorterElement 조회
     */
    public List<SorterElement> getSorterElementsBySorterId(int sorterId) {
        return sorterElementMapper.findBySorterId(sorterId);
    }

    /**
     * 특정 정렬자에 연결된 요소 ID 목록만 조회
     */
    public List<Integer> getElementIdsBySorterId(int sorterId) {
        return sorterElementMapper.findElementIdsBySorterId(sorterId);
    }

    /**
     * 요소 ID로 이름 조회
     */
    public String getElementNameById(int elementId) {
        return elementMapper.getElementNameById(elementId);
    }

    /**
     * 정렬자에 요소 추가 (중복 체크 포함)
     */
    @Transactional
    public void addElementToSorter(int sorterId, int elementId) {
        if (!sorterElementMapper.existsBySorterIdAndElementId(sorterId, elementId)) {
            SorterElement sorterElement = new SorterElement();
            sorterElement.setSorter_id(sorterId);
            sorterElement.setElements_id(elementId);
            sorterElementMapper.insertSorterElement(sorterElement);
        } else {
            throw new IllegalStateException("이미 이 요소는 해당 정렬자에 존재합니다.");
        }
    }

    /**
     * 정렬자에서 요소 하나 제거
     */
    @Transactional
    public void removeElementFromSorter(int sorterId, int elementId) {
        sorterElementMapper.deleteSorterElement(sorterId, elementId);
    }

    /**
     * 정렬자에서 여러 요소 제거
     */
    @Transactional
    public void removeElementsFromSorter(int sorterId, List<Integer> elementIds) {
        sorterElementMapper.deleteBySorterIdAndElementIds(sorterId, elementIds);
    }
}
