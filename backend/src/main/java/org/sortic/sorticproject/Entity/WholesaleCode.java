package org.sortic.sorticproject.Entity;


import lombok.Data;

@Data
public class WholesaleCode {
    private int wholesaleCodeId;   // 도매 코드 고유 ID (기본키)
    private String wholesaleCode;     // 직접 입력되는 도매 코드
    private String userId;         // 유저 아이디 (Users 테이블 참조)
}

