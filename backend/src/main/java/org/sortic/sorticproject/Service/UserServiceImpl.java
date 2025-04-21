package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.User;
import org.sortic.sorticproject.Mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

/**
 * UserService 인터페이스의 구현체
 * 실제 사용자 관련 비즈니스 로직을 처리
 */
@Service // Spring의 서비스 컴포넌트로 등록
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    // 의존성 주입을 위한 final 필드
    private final UserMapper userMapper; // 사용자 데이터 접근을 위한 매퍼
    private final PasswordEncoder passwordEncoder; // 비밀번호 암호화를 위한 인코더

    /**
     * 사용자 등록 로직 구현
     * 1. 아이디 중복 확인
     * 2. 비밀번호 암호화
     * 3. 사용자 정보 저장
     */
    @Override
    @Transactional // 트랜잭션 관리 (데이터 일관성 보장)
    public User signup(User user) {
        // 아이디 중복 확인
        if (userMapper.existsByUserId(user.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        // 비밀번호 암호화
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setGrade(0);  // 명시적으로 grade를 0으로 설정

        // 사용자 정보 저장
        userMapper.save(user);
        return user;
    }

    /**
     * 아이디 중복 확인 로직 구현
     */
    @Override
    public boolean checkUserId(String userId) {
        return !userMapper.existsByUserId(userId);
    }

    /**
     * [데이터 흐름 요약]
     * 1. 데이터 소스:
     *    - UserService 인터페이스를 통해 전달된 사용자 데이터
     *    - UserMapper를 통해 조회된 기존 사용자 데이터
     * 2. 데이터 처리:
     *    - 비밀번호 암호화 (PasswordEncoder 사용)
     *    - 아이디 중복 검사
     *    - 트랜잭션 관리 (@Transactional)
     * 3. 데이터 저장/전달:
     *    - 처리된 데이터를 UserMapper를 통해 데이터베이스에 저장
     *    - 처리 결과를 UserService 인터페이스를 통해 Controller로 반환
     */

    public User findByUserId(String userId) {
        return userMapper.findByUserId(userId);
    }

    @Override
    public boolean existsByUserId(String userId) {
        return userMapper.existsByUserId(userId);
    }

    @Override
    public User login(String userId, String password) {
        User user = userMapper.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("존재하지 않는 아이디입니다.");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        return user;
    }
}
