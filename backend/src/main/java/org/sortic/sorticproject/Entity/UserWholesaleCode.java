package org.sortic.sorticproject.Entity;



import lombok.Data;

@Data
public class UserWholesaleCode {
    private int userWholesaleCodeId;   // 유저 도매 코드 고유 ID (기본키)
    private int userWholesaleCode;     // 유저가 등록한 도매 코드 (중복 불가)
    private String userId;             // 유저 아이디 (Users 테이블 참조)
}

