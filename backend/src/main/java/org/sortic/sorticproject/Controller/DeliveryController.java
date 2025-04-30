package org.sortic.sorticproject.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private static final String apiKey = "HvhDyUeSA8h8hbDwMO7RWw";
    private static final String baseURL = "https://info.sweettracker.co.kr";

    @GetMapping("/getCompanyList")
    public ResponseEntity<String> getCompanyList() {
        String companyListApi = "/api/v1/companylist";
        String url = baseURL+companyListApi + "?t_key=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);
        System.out.println(response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tracking")
    public ResponseEntity<String> trackDelivery(@RequestBody Map<String, String> params) {
        String code = params.get("code");
        String invoice = params.get("invoice");

        String trackingApi = "/api/v1/trackingInfo";
        String url = baseURL + trackingApi + "?t_key=" + apiKey + "&t_code=" + code + "&t_invoice=" + invoice;
        System.out.println("스마트택배 요청 URL: " + url);

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);
        System.out.println("스마트택배 응답: " + response);

        return ResponseEntity.ok(response);
    }




}
