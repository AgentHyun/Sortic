package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.Sorter;
import org.sortic.sorticproject.Mapper.SorterMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class SorterService {

    @Autowired
    private SorterMapper sorterMapper;

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



}