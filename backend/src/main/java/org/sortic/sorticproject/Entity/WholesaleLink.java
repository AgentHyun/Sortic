package org.sortic.sorticproject.Entity;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class WholesaleLink {
    private int wholesaleLinkId;     // 도매 연결 ID (기본키)
    private int wholesaleCodeId;     // WholesaleCode의 기본키 참조
    private String userId;           // 유저 아이디 (Users 테이블 참조)
    private String wholesaleName;    // 도매처 이름 (username으로 시작, 수정 가능)
    private Timestamp createdAt;     // 생성 시간 (기본값 CURRENT_TIMESTAMP)
}
