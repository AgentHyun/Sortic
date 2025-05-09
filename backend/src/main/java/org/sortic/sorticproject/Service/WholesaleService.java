// WholesaleService.java
package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.WholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleLink;
import org.sortic.sorticproject.Mapper.WholesaleMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WholesaleService {

    private final WholesaleMapper wholesaleMapper;

    // 도매 코드
    public void addWholesaleCode(WholesaleCode code) {
        wholesaleMapper.insertWholesaleCode(code);
    }

    public List<WholesaleCode> getCodesByUser(String userId) {
        return wholesaleMapper.getWholesaleCodesByUserId(userId);
    }

    public void deleteWholesaleCode(int codeId) {
        wholesaleMapper.deleteWholesaleCode(codeId);
    }

    // 도매 링크
    public void addWholesaleLink(WholesaleLink link) {
        wholesaleMapper.insertWholesaleLink(link);
    }

    public List<WholesaleLink> getLinksByUser(String userId) {
        return wholesaleMapper.getWholesaleLinksByUserId(userId);
    }

    public void updateWholesaleName(WholesaleLink link) {
        wholesaleMapper.updateWholesaleLinkName(link);
    }

    public void deleteWholesaleLink(int linkId) {
        wholesaleMapper.deleteWholesaleLink(linkId);
    }

    public String findUsernameByUserId(String userId) {
        String username = wholesaleMapper.findUsernameByUserId(userId);
        if (username == null) {
            throw new RuntimeException("해당 유저를 찾을 수 없습니다.");
        }
        return username;
    }

    public void addWholesaleLinkByCode(int wholesaleCode) {
        // 1. 도매 코드 존재 여부 확인

        WholesaleCode codeEntity = wholesaleMapper.findWholesaleCodeByCode(wholesaleCode);

        if (codeEntity == null) {
            throw new IllegalArgumentException("해당 도매 코드는 존재하지 않습니다.");
        }

        // 2. 해당 코드에 연결된 유저 ID 확인
        String userId = codeEntity.getUserId();

        // 3. 유저 ID로 유저 이름 조회
        String username = wholesaleMapper.findUsernameByUserId(userId);
        if (username == null) {
            throw new IllegalArgumentException("해당 유저의 이름을 찾을 수 없습니다.");
        }

        // 4. WholesaleLink 객체 생성 및 저장
        WholesaleLink link = new WholesaleLink();
        link.setUserId(userId);  // 링크 테이블의 user_id는 코드 소유자
        link.setWholesaleCodeId(codeEntity.getWholesaleCodeId());
        link.setWholesaleName(username);

        wholesaleMapper.insertWholesaleLink(link);
    }
    public Integer getWholesaleCodeById(int wholesaleCodeId) {
        Integer code = wholesaleMapper.findWholesaleCodeById(wholesaleCodeId);
        if (code == null) {
            throw new IllegalArgumentException("해당 ID에 해당하는 도매 코드가 존재하지 않습니다.");
        }
        return code;
    }
    public List<WholesaleCode> searchWholesaleCodesByKeyword(String keyword) {
        return wholesaleMapper.searchWholesaleCodesByKeyword(keyword);
    }

}
