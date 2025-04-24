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
    private ElementMapper elementMapper;  // Assuming you have an ElementMapper for database access

    public void addSorter(Sorter sorter) {
        sorterMapper.insertSorter(sorter);
    }

    public Sorter getSorterById(int sorterId) {
        return sorterMapper.getSorterById(sorterId);
    }

    public List<Sorter> getSortersByUserId(String userId) {
        return sorterMapper.getSortersByUserId(userId);
    }

    public void deleteSorter(int sorterId) {
        sorterMapper.deleteSorter(sorterId);
    }
    public void deleteMultipleSorters(List<Integer> sorterIds) {


        sorterMapper.deleteMultipleSorters(sorterIds);  // 하나의 쿼리로 여러 sorter_id를 삭제
    }


    @Transactional
    public List<Sorter> reorderSorterNumbers(List<Sorter> sorters) {
        for (int i = 0; i < sorters.size(); i++) {
            Sorter s = sorters.get(i);
            s.setSorter_number(i + 1);
            s.setSorter_name("sorter" + (i + 1));
            sorterMapper.updateSorterNumberAndName(s);
        }
        return sorters;
    }


    public List<Sorter> updateSorterName(String oldSorterName, String sorterName) {
        int result = sorterMapper.updateSorterName(oldSorterName, sorterName);
        if (result > 0) {
            return sorterMapper.findAllByName(sorterName);
        }
        return Collections.emptyList();
    }

    public String getSorterNameById(int sorterId) {
        return sorterMapper.getSorterNameById(sorterId);
    }

    public List<Integer> getElementsIdBySorterName(String sorterName) {
        return sorterMapper.getElementsIdBySorterName(sorterName);
    }

    public Integer getSorterIdByNameAndElementId(String sorterName, int elementsId) {
        return sorterMapper.findSorterIdByNameAndElementId(sorterName, elementsId);
    }

    // Add element to sorter by sorter name
    @Transactional
    public Sorter addElementToSorter(String sorterName, Element element) {
        // Check if the sorter exists
        Sorter sorter = sorterMapper.findSorterByName(sorterName);
        if (sorter == null) {
            throw new RuntimeException("해당 sorterName에 해당하는 정렬자가 존재하지 않습니다.");
        }

        // Set the new element id to the sorter
        int elementId = element.getElements_name_id();
        if (elementMapper.getElementById(elementId) == null) {
            throw new RuntimeException("해당 elementId에 해당하는 요소가 존재하지 않습니다.");
        }

        Sorter newSorter = new Sorter();
        newSorter.setUser_id(sorter.getUser_id());
        newSorter.setSorter_name(sorter.getSorter_name());
        newSorter.setSorter_number(sorterMapper.getMaxSorterNumberByUserId(sorter.getUser_id()) + 1);

        sorterMapper.insertSorter(newSorter);
        return newSorter;
    }

    // Check if element exists in sorter by name
    public boolean doesElementExistInSorterByName(String sorterName, int elementsId) {
        return sorterMapper.existsElementInSorterByName(sorterName, elementsId);
    }

    public List<Sorter> getUniqueSortersByUserId(String userId) {
        // Mapper 메서드를 호출하여 사용자 ID에 해당하는 고유한 정렬자 목록을 가져옵니다.
        return sorterMapper.selectUniqueSortersByUserId(userId);
    }
}
