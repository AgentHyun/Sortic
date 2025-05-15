package org.sortic.sorticproject.Entity;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class WholesaleLink {
    private int wholesaleLinkId;      // 도매 연결 ID (기본키)
    private int wholesaleCodeId;      // 도매 코드 ID (WholesaleCode의 기본키 참조)
    private String userId;            // 유저 아이디 (Users 테이블 참조)
    private String wholesaleName;     // 도매처 이름 (store_name으로 시작, 수정 가능)
    private String wholesaleMemo;     // ✅ 도매 메모 (추가된 필드)
    private Timestamp createdAt;      // 생성 시간
}
