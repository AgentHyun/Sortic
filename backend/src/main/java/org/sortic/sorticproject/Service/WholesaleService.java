// WholesaleService.java
package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.UserWholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleLink;
import org.sortic.sorticproject.Mapper.WholesaleMapper;
import org.springframework.dao.DuplicateKeyException;
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

    public void addWholesaleLinkByCode(String wholesaleCode, String currentUserId) {
        try {
            // 1. 도매 코드 존재 여부 확인
            WholesaleCode codeEntity = wholesaleMapper.findWholesaleCodeByCode(wholesaleCode);
            if (codeEntity == null) {
                throw new IllegalArgumentException("해당 도매 코드는 존재하지 않습니다.");
            }

            // 2. 코드 소유자의 유저 이름 조회
            String codeOwnerId = codeEntity.getUserId();
            String username = wholesaleMapper.findUsernameByUserId(codeOwnerId);
            if (username == null) {
                throw new IllegalArgumentException("해당 유저의 이름을 찾을 수 없습니다.");
            }

            // 3. WholesaleLink 객체 생성 (현재 로그인한 유저가 등록자)
            WholesaleLink link = new WholesaleLink();
            link.setUserId(currentUserId); // 등록하는 사용자 ID
            link.setWholesaleCodeId(codeEntity.getWholesaleCodeId()); // FK ID 사용
            link.setWholesaleName(username); // 코드 소유자의 닉네임

            wholesaleMapper.insertWholesaleLink(link);

        } catch (DuplicateKeyException e) {
            throw new IllegalArgumentException("이미 등록된 도매 코드입니다.");
        }
    }


    public List<WholesaleCode> searchWholesaleCodesByKeyword(String keyword) {
        return wholesaleMapper.searchWholesaleCodesByKeyword(keyword);
    }

    public Integer getWholesaleCodeById(int wholesaleCodeId) {
        Integer code = wholesaleMapper.findWholesaleCodeById(wholesaleCodeId);
        if (code == null) {
            throw new IllegalArgumentException("해당 ID에 해당하는 도매 코드가 존재하지 않습니다.");
        }
        return code;
    }
    public String getMemoByLinkId(int linkId) {
        return wholesaleMapper.getMemoByLinkId(linkId);
    }

    public void updateWholesaleMemo(WholesaleLink link) {
        wholesaleMapper.updateMemo(link);
    }

    public void addUserWholesaleCode(UserWholesaleCode userCode) {
        // 중복 체크
        if (wholesaleMapper.isUserWholesaleCodeExists(userCode.getUserWholesaleCode()) > 0) {
            throw new IllegalArgumentException("이미 존재하는 도매 코드입니다.");
        }
        wholesaleMapper.insertUserWholesaleCode(userCode);
    }
    public String findUserIdByWholesaleName(String wholesaleName) {
        return wholesaleMapper.findUserIdByWholesaleName(wholesaleName);
    }




}
