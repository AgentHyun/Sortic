package com.example.demo.card.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.SelectKey;
import com.example.demo.card.dto.Card;

public interface CardMapper {

    // Card를 저장하고, 삽입된 행의 개수를 반환 (id는 @SelectKey로 세팅됨)
    @Insert("INSERT INTO cards (number, name, quantity, cost, category) VALUES (#{number}, #{name}, #{quantity}, #{cost}, #{category})")
    @SelectKey(statement = "SELECT LAST_INSERT_ID()", keyProperty = "id", before = false, resultType = Long.class)
    int insertCard(Card card);  // 반환 타입을 int로 변경
}
