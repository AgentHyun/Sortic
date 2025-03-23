package com.example.demo.card.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.card.dto.Card;
import com.example.demo.card.service.CardService;

@RestController
@RequestMapping("/cards")
@CrossOrigin(origins = "http://localhost:3000")  // React 개발 서버에서 오는 요청을 허용
public class CardController {

    @Autowired
    private CardService cardService;

    // 카드 등록 API
    @PostMapping("/add")
    public ResponseEntity<Card> addCard(@RequestBody Card card) {
        // 카드 저장 후 저장된 카드 객체 반환
        Card savedCard = cardService.saveCard(card);
        
        // 저장된 카드 객체를 반환
        return ResponseEntity.ok(savedCard);
    }

    // 테스트 엔드포인트
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Test endpoint working!");
    }
}
