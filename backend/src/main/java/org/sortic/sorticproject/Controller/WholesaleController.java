// WholesaleController.java
package org.sortic.sorticproject.Controller;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.WholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleLink;
import org.sortic.sorticproject.Service.UserService;
import org.sortic.sorticproject.Service.WholesaleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/username/{userId}")
    public ResponseEntity<?> getUsernameByUserId(@PathVariable String userId) {
        try {
            String username = wholesaleService.findUsernameByUserId(userId);
            return ResponseEntity.ok(Collections.singletonMap("username", username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", e.getMessage()));
        }
    }
    @PostMapping("/link/by-code")
    public ResponseEntity<?> createLinkByCode(@RequestParam int wholesaleCode) {
        try {
            wholesaleService.addWholesaleLinkByCode(wholesaleCode);
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
    // WholesaleController.java
    @GetMapping("/code/search")
    public ResponseEntity<?> searchWholesaleCodes(@RequestParam String keyword) {
        try {
            List<WholesaleCode> result = wholesaleService.searchWholesaleCodesByKeyword(keyword);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("도매 코드 검색 중 오류 발생: " + e.getMessage());
        }
    }

}
