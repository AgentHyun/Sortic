package org.sortic.sorticproject.Controller;

import org.sortic.sorticproject.Entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public interface AuthController {
    /**
     * 회원가입 요청을 처리하는 메서드
     *
     * @param user 회원가입 정보를 포함한 User 객체
     * @return 요청 결과를 나타내는 ResponseEntity 객체
     */

    @PostMapping("/signup")
    ResponseEntity<?> signup(@RequestBody User user);

    /**
     * 사용자 이름 중복 여부를 확인하는 메서드
     *
     * @param username 확인할 사용자 이름
     * @return 이름 중복 여부를 나타내는 ResponseEntity 객체
     */
    @GetMapping("/check-username/{username}")
    ResponseEntity<?> checkUsername(@PathVariable String username);
}
