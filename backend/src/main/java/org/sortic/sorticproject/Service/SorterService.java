package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.Element;
import org.sortic.sorticproject.Entity.Sorter;
import org.sortic.sorticproject.Mapper.ElementMapper;
import org.sortic.sorticproject.Mapper.SorterMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class SorterService {

    @Autowired
    private SorterMapper sorterMapper;
    @Autowired
    private ElementMapper elementMapper;

    public void addSorter(Sorter sorter) {
        sorterMapper.insertSorter(sorter);
    }

    public Sorter getSorterById(int sorter_id) {
        return sorterMapper.getSorterById(sorter_id);
    }

    public List<Sorter> getSortersByUserId(String user_id) {
        return sorterMapper.getSortersByUserId(user_id);
    }

    public void updateSorter(int sorter_id, String sorter_name, int elements_id, int sorter_number) {
        sorterMapper.updateSorter(sorter_id, sorter_name, elements_id, sorter_number);
    }

    public void deleteSorter(int sorter_id) {
        sorterMapper.deleteSorter(sorter_id);
    }

    @Transactional
    public List<Sorter> reorderSorterNumbers(List<Sorter> sorters) {
        if (sorters == null || sorters.isEmpty()) return Collections.emptyList();

        String userId = sorters.get(0).getUser_id();
        sorterMapper.deleteAllSortersForUser(userId);

        List<Sorter> inserted = new ArrayList<>();

        for (int i = 0; i < sorters.size(); i++) {
            Sorter s = sorters.get(i);
            s.setSorter_number(i + 1);
            s.setSorter_name("sorter" + (i + 1));
            sorterMapper.insertSorter(s);
            inserted.add(s);
        }

        return inserted;
    }

    public Sorter updateSorterName(int sorterId, String sorterName) {
        sorterMapper.updateSorterName(sorterId, sorterName);
        return sorterMapper.getSorterById(sorterId);
    }


    public void deleteMultipleSorters(List<Integer> sorterIds) {
        sorterMapper.deleteMultipleSorters(sorterIds);
    }
    @Transactional
    public Sorter updateElementsId(int sorterId, int elementsId) {
        // sorterId로 해당 Sorter 객체 조회
        Sorter sorter = sorterMapper.getSorterById(sorterId);

        // 만약 Sorter가 존재하지 않으면 예외 처리
        if (sorter == null) {
            throw new RuntimeException("해당 sorterId에 해당하는 정렬자가 존재하지 않습니다.");
        }

        // elements_id 업데이트
        sorter.setElements_id(elementsId);

        // 데이터베이스에 elements_id 업데이트
        sorterMapper.updateElementsId(sorterId, elementsId);

        // 업데이트된 Sorter 객체 반환
        return sorterMapper.getSorterById(sorterId);
    }

    public Integer getElementsIdBySorterId(int sorterId) {
        Sorter sorter = sorterMapper.getSorterById(sorterId);
        return sorter != null ? sorter.getElements_id() : null;
    }
    public String getSorterNameById(int sorterId) {
        return sorterMapper.getSorterNameById(sorterId);
    }
    public List<Sorter> getUniqueSortersByUserId(String userId) {
        return sorterMapper.getSortersByUserId(userId);
    }


    public List<Integer> getElementsIdBySorterName(String sorterName) {
        // sorterMapper에서 여러 개의 elements_id를 가져오는 메소드 호출
        return sorterMapper.getElementsIdBySorterName(sorterName);
    }


}