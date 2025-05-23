// WholesaleService.java
package org.sortic.sorticproject.Service;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.UserWholesaleCode;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Entity.WholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleLink;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.sortic.sorticproject.Mapper.WholesaleMapper;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class WholesaleService {

    private final WholesaleMapper wholesaleMapper;
    private final UserMapper userMapper;
    public void addWholesaleCode(WholesaleCode code) {
        int exists = wholesaleMapper.countWholesaleCodeByUser(code.getUserId());
        if (exists > 0) {
            throw new IllegalArgumentException("해당 유저는 이미 도매 코드를 등록했습니다.");
        }

        wholesaleMapper.insertWholesaleCode(code);
    }



    public List<WholesaleCode> getCodesByUser(String userId) {
        List<WholesaleCode> result = wholesaleMapper.getWholesaleCodesByUserId(userId);
        return result;
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
        if (wholesaleMapper.isUserWholesaleCodeExists(userCode.getUserWholesaleCode(), userCode.getUserId()) > 0) {
            throw new IllegalArgumentException("이미 존재하는 도매 코드입니다.");
        }
        wholesaleMapper.insertUserWholesaleCode(userCode);
    }

    public String findUserIdByWholesaleName(String wholesaleName) {
        return wholesaleMapper.findUserIdByWholesaleName(wholesaleName);
    }

    public List<UserWholesaleCode> getUserWholesaleCodesByUserId(String userId) {
        return wholesaleMapper.getUserWholesaleCodesByUserId(userId);
    }
    public String getUserIdByWholesaleCodeId(int wholesaleCodeId) {
        String userId = wholesaleMapper.findUserIdByWholesaleCodeId(wholesaleCodeId);
        if (userId == null) {
            throw new IllegalArgumentException("해당 ID의 도매 코드가 존재하지 않습니다.");
        }
        return userId;
    }
    public String findUserIdByUsername(String username) {
        return wholesaleMapper.findUserIdByUsername(username);
    }

    public void deleteUserWholesaleCode(int userWholesaleCode) {
        wholesaleMapper.deleteUserWholesaleCode(userWholesaleCode);
    }

    public Integer getUserWholesaleCodeIdByCode(String userWholesaleCode) {
        Integer id = wholesaleMapper.findUserWholesaleCodeIdByCode(userWholesaleCode);
        if (id == null) {
            throw new IllegalArgumentException("해당 도매 코드를 찾을 수 없습니다.");
        }
        return id;
    }

    public void addWholesaleLinkByCode(String wholesaleCode, String userId) {
        WholesaleCode code = wholesaleMapper.findWholesaleCodeByCode(wholesaleCode);
        if (code == null) {
            throw new IllegalArgumentException("존재하지 않는 도매 코드입니다.");
        }

        int wholesaleCodeId = code.getWholesaleCodeId();

        // ✅ 중복 체크
        int exists = wholesaleMapper.isUserWholesaleCodeExists(wholesaleCode, userId);
        if (exists > 0) {
            throw new IllegalArgumentException("이미 등록된 도매 링크입니다.");
        }

        // ✅ username 가져와서 도매 이름으로 설정
        String username = wholesaleMapper.findUsernameByUserId(code.getUserId());

        WholesaleLink link = new WholesaleLink();
        link.setWholesaleCodeId(wholesaleCodeId);
        link.setUserId(userId);
        link.setWholesaleName(username);
        link.setWholesaleMemo(""); // 초기값

        wholesaleMapper.insertWholesaleLink(link);



    }
    public int countLinksByUser(String userId) {
        return wholesaleMapper.countLinksByUserId(userId);
    }

    public Map<String, Object> generateWholesalerCodeIfAbsent(String userId) {
        Users user = userMapper.findByUserId(userId);

        if (user == null) {
            throw new IllegalArgumentException("해당 유저가 존재하지 않습니다.");
        }

        String existingCode = user.getWholesaler_code();
        Map<String, Object> result = new HashMap<>();

        if (existingCode != null && !existingCode.trim().isEmpty()) {
            result.put("wholesalerCode", existingCode);
            result.put("status", "EXISTING");  // 기존 존재
            return result;
        }

        String code = generateRandomCode(6);


        result.put("wholesalerCode", code);
        result.put("status", "CREATED");  // 새로 생성됨
        return result;
    }



    public String generateRandomCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }


    public void cloneUserWithWholesalerCode(String originalUserId, String wholesalerCode) {
        // ✅ 항상 원본 유저로 검사
        Users original = userMapper.findByUserId(originalUserId);

        if (original == null) {
            throw new IllegalArgumentException("기존 유저를 찾을 수 없습니다.");
        }

        // ✅ 한 번이라도 복제됐다면 막기
        if (Boolean.TRUE.equals(original.getIsCloned())) {
            throw new IllegalStateException("이미 복제된 유저입니다.");
        }

        String newUserId = originalUserId + "_" + wholesalerCode;

        // ✅ 복제 대상 userId 중복 체크
        if (userMapper.findByUserId(newUserId) != null) {
            throw new IllegalStateException("이미 해당 도매 코드로 복제된 유저가 존재합니다.");
        }

        // ✅ 복제 유저 생성
        Users copy = Users.builder()
            .userId(newUserId)
            .password(original.getPassword())
            .username(original.getUsername())
            .phone(original.getPhone())
            .wholesaler_code(wholesalerCode)
            .email(original.getEmail())
            .region(original.getRegion())
            .grade(original.getGrade())
            .profile_image(original.getProfile_image())
            .build();

        wholesaleMapper.insertUser(copy); // insert 시 is_cloned = true로 저장됨
        wholesaleMapper.updateClonedFlag(originalUserId, true);    }



    public String getWholesalerCodeByUserId(String userId) {
        String code = wholesaleMapper.getWholesalerCodeByUserId(userId);
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("해당 유저의 도매 코드가 존재하지 않습니다.");
        }
        return code;
    }

    // WholesaleService.java
    public boolean isCloned(String userId) {
        return wholesaleMapper.countClonedUsers(userId) > 0;
    }
    public String getClonedUserId(String originalUserId) {
        return wholesaleMapper.findClonedUserId(originalUserId);
    }

    public void updateUserWholesaleCodeByUserId(UserWholesaleCode userCode) {
        if (userCode.getUserId() == null || userCode.getUserWholesaleCode() == null) {
            throw new IllegalArgumentException("유저 ID 또는 도매 코드가 비어 있습니다.");
        }
        wholesaleMapper.updateWholesaleCodeByUserId(userCode);
    }

    public List<String> findUserIdsByUserWholesaleCode(String userWholesaleCode) {
        if (userWholesaleCode == null || userWholesaleCode.trim().isEmpty()) {
            throw new IllegalArgumentException("도매 코드가 비어 있습니다.");
        }

        return wholesaleMapper.findUserIdsByUserWholesaleCode(userWholesaleCode);
    }

    public List<String> findUserIdsByOwnerUserId(String ownerUserId) {
        return wholesaleMapper.findUserIdsByWholesaleCodeIdFromUserCode(ownerUserId);
    }


}



