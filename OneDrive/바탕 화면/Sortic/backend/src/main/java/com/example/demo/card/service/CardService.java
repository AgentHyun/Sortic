package com.example.demo.card.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.card.dto.Card;
import com.example.demo.card.mapper.CardMapper;

@Service
public class CardService {
    @Autowired
    private CardMapper cardMapper;

    public Card saveCard(Card card) {
        cardMapper.insertCard(card);  // 카드를 저장
        return card;  // 저장된 카드 객체 반환 (ID 포함)
    }
}
