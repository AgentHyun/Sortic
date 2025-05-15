// WholesaleController.java
package org.sortic.sorticproject.Controller;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.UserWholesaleCode;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Entity.WholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleLink;
import org.sortic.sorticproject.Service.UserService;
import org.sortic.sorticproject.Service.WholesaleService;
import org.sortic.sorticproject.security.CustomUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wholesale")
public class WholesaleController {

    private final WholesaleService wholesaleService;
    private final UserService userService;

    // 도매 코드
    @PostMapping("/code")
    public void createCode(@RequestBody WholesaleCode code) {
        wholesaleService.addWholesaleCode(code);
    }

    @GetMapping("/codes/{userId}")
    public List<WholesaleCode> getCodes(@PathVariable String userId) {
        return wholesaleService.getCodesByUser(userId);
    }

    @DeleteMapping("/code/{id}")
    public void deleteCode(@PathVariable int id) {
        wholesaleService.deleteWholesaleCode(id);
    }

    // 도매 링크
    @PostMapping("/link")
    public void createLink(@RequestBody WholesaleLink link) {
        wholesaleService.addWholesaleLink(link);
    }

    @GetMapping("/links/{userId}")
    public List<WholesaleLink> getLinks(@PathVariable String userId) {
        return wholesaleService.getLinksByUser(userId);
    }

    @PutMapping("/link")
    public void updateLink(@RequestBody WholesaleLink link) {
        wholesaleService.updateWholesaleName(link);
    }

    @DeleteMapping("/link/{id}")
    public void deleteLink(@PathVariable int id) {
        wholesaleService.deleteWholesaleLink(id);
    }

    @GetMapping("/store-name/{userId}")
    public ResponseEntity<?> getStoreNameByUserId(@PathVariable String userId) {
        try {
            String storeName = wholesaleService.findStoreNameByUserId(userId);
            return ResponseEntity.ok(Collections.singletonMap("store_name", storeName));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("도매처 이름 조회 실패");
        }
    }

    @PostMapping("/link/by-code")
    public ResponseEntity<?> createLinkByCode(@RequestParam int wholesaleCode,
                                              @RequestParam String userId) {
        try {
            wholesaleService.addWholesaleLinkByCode(wholesaleCode, userId);
            return ResponseEntity.ok().body("도매 링크가 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

    @GetMapping("/code/{id}")
    public ResponseEntity<?> getWholesaleCodeById(@PathVariable int id) {
        try {
            Integer code = wholesaleService.getWholesaleCodeById(id);
            return ResponseEntity.ok(Collections.singletonMap("wholesaleCode", code));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/code/search")
    public ResponseEntity<?> searchWholesaleCodes(@RequestParam(value = "keyword", required = false) String keyword) {
        try {
            if (keyword == null || keyword.isBlank()) {
                return ResponseEntity.badRequest().body("검색어가 비어 있습니다.");
            }

            List<WholesaleCode> result = wholesaleService.searchWholesaleCodesByKeyword(keyword);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace(); // ✅ 콘솔에 전체 원인 출력
            return ResponseEntity.badRequest().body("도매 코드 검색 중 오류 발생: " + e.getClass().getSimpleName());
        }
    }

    @PutMapping("/link/memo")
    public ResponseEntity<?> updateWholesaleMemo(@RequestBody WholesaleLink link) {
        try {
            wholesaleService.updateWholesaleMemo(link);
            return ResponseEntity.ok("메모가 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("메모 수정 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/link/memo/{linkId}")
    public ResponseEntity<?> getWholesaleMemo(@PathVariable int linkId) {
        try {
            String memo = wholesaleService.getMemoByLinkId(linkId);
            return ResponseEntity.ok(Collections.singletonMap("memo", memo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", "메모를 찾을 수 없습니다."));
        }
    }

    // 유저 도매 코드 등록
    @PostMapping("/user-code")
    public ResponseEntity<?> createUserWholesaleCode(@RequestBody UserWholesaleCode userCode) {
        try {
            wholesaleService.addUserWholesaleCode(userCode);
            return ResponseEntity.ok("유저 도매 코드가 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록 중 오류 발생");
        }
    }

    @GetMapping("/user-id/by-link-name")
    public ResponseEntity<?> getUserIdByLinkName(@RequestParam String name) {
        try {
            String userId = wholesaleService.findUserIdByWholesaleName(name);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "해당 이름의 도매 링크에 대한 유저 ID를 찾을 수 없습니다."));
            }
            return ResponseEntity.ok(Collections.singletonMap("userId", userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "유저 ID 조회 중 오류 발생"));
        }
    }
}
