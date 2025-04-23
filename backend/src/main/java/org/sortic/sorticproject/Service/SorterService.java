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

    public List<Sorter> updateSorterName(String oldSorterName, String sorterName) {
        int result = sorterMapper.updateSorterName(oldSorterName, sorterName);

        if (result > 0) {
            // 변경된 이름으로 된 모든 Sorter 반환
            return sorterMapper.findAllByName(sorterName);
        }
        return Collections.emptyList();
    }




    public void deleteElementsBySorterNameAndIds(String sorterName, List<Integer> elementIds) {
        sorterMapper.deleteElementsBySorterNameAndIds(sorterName, elementIds);
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
    public Integer getSorterIdByNameAndElementId(String sorterName, int elementsId) {
        return sorterMapper.findSorterIdByNameAndElementId(sorterName, elementsId);
    }
    @Transactional
    public Sorter addElementToSorter(int sorterId, int elementId) {
        // sorterId로 해당 Sorter 객체 조회
        Sorter sorter = sorterMapper.getSorterById(sorterId);

        // 만약 Sorter가 존재하지 않으면 예외 처리
        if (sorter == null) {
            throw new RuntimeException("해당 sorterId에 해당하는 정렬자가 존재하지 않습니다.");
        }

        // elementId로 해당 Element 객체 조회
        Element element = elementMapper.getElementById(elementId);

        // 만약 Element가 존재하지 않으면 예외 처리
        if (element == null) {
            throw new RuntimeException("해당 elementId에 해당하는 요소가 존재하지 않습니다.");
        }

        // 새로운 Sorter를 생성해서 기존 Sorter의 이름을 그대로 유지하면서 요소만 추가
        Sorter newSorter = new Sorter();
        newSorter.setUser_id(sorter.getUser_id()); // 기존의 user_id 유지
        newSorter.setElements_id(elementId); // 새 요소의 ID 설정
        newSorter.setSorter_name(sorter.getSorter_name()); // 기존의 sorter_name을 그대로 유지
        newSorter.setSorter_number(sorterMapper.getMaxSorterNumberByUserId(sorter.getUser_id()) + 1); // 새로운 정렬자 번호 설정

        // 새로운 Sorter 삽입
        sorterMapper.insertSorter(newSorter);

        // 삽입된 새로운 Sorter 반환
        return newSorter;
    }

    // sorter_name으로 정렬자 찾기
    public Sorter findSorterByName(String sorterName) {
        return sorterMapper.findSorterByName(sorterName);
    }


    @Transactional
    public Sorter addElementToSorter(Sorter newSorter) {
        // sorter_name을 기준으로 정렬자 찾기
        int maxSorterNumber = sorterMapper.getMaxSorterNumberByUserId(newSorter.getUser_id());
        newSorter.setSorter_number(maxSorterNumber + 1);  // 새로 추가된 정렬자 번호

        sorterMapper.addElementToSorter(newSorter);  // 정렬자에 요소 추가
        return newSorter;  // 새로 추가된 정렬자 반환
    }
    public boolean doesElementExistInSorterByName(String sorterName, int elementsId) {
        // DB에서 해당 요소가 지정된 정렬자 이름에 포함되어 있는지 확인
        return sorterMapper.existsElementInSorterByName(sorterName, elementsId);
    }

}
