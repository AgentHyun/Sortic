package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.ElementsDataRequest;
import org.sortic.sorticproject.Service.ElementsDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/elements_data")
public class ElementsDataController {

    @Autowired
    private ElementsDataService elementsDataService;

    @PostMapping("/add_elements_data")
    public String addElementsData(@RequestBody ElementsDataRequest request) {
        int id = request.getElements_name_id();
        List<Map<String, String>> dataList = request.getData();

        for (Map<String, String> data : dataList) {
            for (Map.Entry<String, String> entry : data.entrySet()) {
                elementsDataService.addElementData(id, entry.getKey(), entry.getValue());
            }
        }

        return "요소 데이터가 성공적으로 추가되었습니다!";
    }



    @GetMapping("/get_elements_data")
    public List<Map<String, Object>> getElementsData(@RequestParam int elements_name_id) {
        return elementsDataService.getElementsDataByElementNameId(elements_name_id);
    }


    @DeleteMapping("/delete_elements_data")
    public String deleteElementsData(@RequestParam int elements_id) {
        elementsDataService.deleteElementsData(elements_id);
        return "요소 데이터가 성공적으로 삭제되었습니다!";
    }


    @DeleteMapping("/delete_all_elements_data")
    public String deleteAllElementsData(@RequestParam int elements_name_id) {
        elementsDataService.deleteAllElementsData(elements_name_id);
        return "해당 요소의 모든 데이터가 삭제되었습니다!";
    }


    @PutMapping("/update_key_name")
    public String updateKeyName(@RequestParam int elements_id, @RequestParam String key_name) {
        elementsDataService.updateKeyName(elements_id, key_name);
        return "Key 이름이 성공적으로 수정되었습니다!";
    }


    @PutMapping("/update_value_name")
    public String updateValueName(@RequestParam int elements_id, @RequestParam String value_name) {
        elementsDataService.updateValueName(elements_id, value_name);
        return "Value 이름이 성공적으로 수정되었습니다!";
    }

}
