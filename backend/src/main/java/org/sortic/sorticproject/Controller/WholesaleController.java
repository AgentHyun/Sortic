// WholesaleController.java
package org.sortic.sorticproject.Controller;

import lombok.RequiredArgsConstructor;
import org.sortic.sorticproject.Entity.UserWholesaleCode;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Entity.WholesaleCode;
import org.sortic.sorticproject.Entity.WholesaleLink;
import org.sortic.sorticproject.Mapper.WholesaleMapper;
import org.sortic.sorticproject.Service.UserService;
import org.sortic.sorticproject.Service.WholesaleService;
import org.sortic.sorticproject.security.CustomUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wholesale")
public class WholesaleController {

    private final WholesaleService wholesaleService;
    private final UserService userService;
    private final WholesaleMapper wholesaleMapper;

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
    public ResponseEntity<?> createLinkByCode(@RequestParam String wholesaleCode,
                                              @RequestParam String userId) {
        try {
            wholesaleService.addWholesaleLinkByCode(wholesaleCode, userId);
            return ResponseEntity.ok().body("도매 링크가 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

    @GetMapping("/link/count")
    public ResponseEntity<Integer> countLinksByUser(@RequestParam String userId) {
        int count = wholesaleService.countLinksByUser(userId);
        return ResponseEntity.ok(count);
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
            e.printStackTrace();
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
            e.printStackTrace();
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
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "유저 ID 조회 중 오류 발생"));

        }
    }

    @GetMapping("wholesale-user-code")
    public ResponseEntity<List<UserWholesaleCode>> getUserWholesaleCodes(@RequestParam String userId) {
        List<UserWholesaleCode> codes = wholesaleService.getUserWholesaleCodesByUserId(userId);
        return ResponseEntity.ok(codes);
    }


    @GetMapping("/user-id-by-code-id")
    public ResponseEntity<String> getUserIdByCodeId(@RequestParam int wholesaleCodeId) {
        String userId = wholesaleService.getUserIdByWholesaleCodeId(wholesaleCodeId);
        return ResponseEntity.ok(userId);
    }

    @GetMapping("/user-id/by-username")
    public ResponseEntity<?> getUserIdByUsername(@RequestParam String username) {
        System.out.println("요청 받은 username: " + username); // 디버깅용 로그

        try {
            String userId = wholesaleService.findUserIdByUsername(username);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "해당 닉네임의 유저를 찾을 수 없습니다."));
            }
            return ResponseEntity.ok(Collections.singletonMap("userId", userId));
        } catch (Exception e) {
            e.printStackTrace(); // 꼭 콘솔에서 전체 에러 로그 확인하세요
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "유저 ID 조회 중 오류 발생"));
        }
    }

    @DeleteMapping("/delete/user-code/{userWholesaleCode}")
    public ResponseEntity<?> deleteUserWholesaleCode(@PathVariable int userWholesaleCode) {
        try {
            wholesaleService.deleteUserWholesaleCode(userWholesaleCode);
            return ResponseEntity.ok("유저 도매 코드가 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("유저 도매 코드 삭제 중 오류 발생");
        }
    }

    @GetMapping("/user-code-id/by-code")
    public ResponseEntity<?> getUserWholesaleCodeIdByCode(@RequestParam String userWholesaleCode) {
        try {
            Integer id = wholesaleService.getUserWholesaleCodeIdByCode(userWholesaleCode);

            // Java 1.7 호환 방식의 Map 생성
            java.util.Map<String, Object> result = new java.util.HashMap<String, Object>();
            result.put("userWholesaleCodeId", id);

            return new ResponseEntity<java.util.Map<String, Object>>(result, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            java.util.Map<String, String> error = new java.util.HashMap<String, String>();
            error.put("message", e.getMessage());
            return new ResponseEntity<java.util.Map<String, String>>(error, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            java.util.Map<String, String> error = new java.util.HashMap<String, String>();
            error.put("message", "유저 도매 코드 ID 조회 중 오류 발생");
            return new ResponseEntity<java.util.Map<String, String>>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/generate-code")
    public ResponseEntity<?> generateWholesalerCode(@RequestParam String userId) {
        try {
            Map<String, Object> result = wholesaleService.generateWholesalerCodeIfAbsent(userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "도매 코드 생성 중 오류 발생"));
        }
    }


    @PostMapping("/clone-user-with-code")
    public ResponseEntity<?> cloneUserWithWholesalerCode(
        @RequestParam String userId,
        @RequestParam String wholesalerCode) {

        try {
            wholesaleService.cloneUserWithWholesalerCode(userId, wholesalerCode);
            String newUserId = userId + "_" + wholesalerCode;
            return ResponseEntity.ok(Collections.singletonMap("newUserId", newUserId));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "유저 복제 중 오류 발생"));
        }
    }

    @GetMapping("/wholesaler-code")
    public ResponseEntity<?> getWholesalerCodeByUserId(@RequestParam String userId) {
        try {
            String code = wholesaleService.getWholesalerCodeByUserId(userId);
            return ResponseEntity.ok(Collections.singletonMap("wholesalerCode", code));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "조회 중 오류 발생"));
        }
    }
    // WholesaleController.java
    @GetMapping("/is-cloned")
    public ResponseEntity<?> isCloned(@RequestParam String userId) {
        boolean result = wholesaleService.isCloned(userId);
        return ResponseEntity.ok().body(Collections.singletonMap("isCloned", result));
    }
    @GetMapping("/cloned")
    public ResponseEntity<?> getClonedUserId(@RequestParam String userId) {
        String clonedUserId = wholesaleService.getClonedUserId(userId); // 단일값
        if (clonedUserId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", "복제된 유저가 없습니다."));
        }
        return ResponseEntity.ok(Collections.singletonMap("userId", clonedUserId)); // ✅ 키 포함
    }
    @PutMapping("/user-code")
    public ResponseEntity<?> updateUserWholesaleCode(@RequestBody UserWholesaleCode userCode) {
        try {
            wholesaleService.updateUserWholesaleCodeByUserId(userCode);
            return ResponseEntity.ok("유저 도매 코드가 수정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "유저 도매 코드 수정 중 오류 발생"));
        }
    }
    @GetMapping("/wholesale-code/by-user-id")
    public ResponseEntity<?> getWholesaleCodesByUserId(@RequestParam String userId) {
        try {
            List<WholesaleCode> codes = wholesaleService.getCodesByUser(userId);
            return ResponseEntity.ok(codes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "유저 ID로 도매 코드 조회 중 오류 발생"));
        }
    }
    @GetMapping("/user-ids/by-user-code")
    public ResponseEntity<?> getUserIdsByUserWholesaleCode(@RequestParam String userWholesaleCode) {
        try {
            List<String> userIds = wholesaleService.findUserIdsByUserWholesaleCode(userWholesaleCode);
            return ResponseEntity.ok(userIds);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "유저 ID 조회 중 오류 발생"));
        }
    }


}



