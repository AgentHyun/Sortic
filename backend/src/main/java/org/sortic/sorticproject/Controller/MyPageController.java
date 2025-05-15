package org.sortic.sorticproject.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;

import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.Mapper.UserMapper;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Users user = userMapper.findByUserId(userId);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자 정보를 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(user);
    }
}
