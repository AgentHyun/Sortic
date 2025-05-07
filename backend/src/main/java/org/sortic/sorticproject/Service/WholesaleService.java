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
}
