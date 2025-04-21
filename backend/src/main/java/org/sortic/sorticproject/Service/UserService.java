package org.sortic.sorticproject.Service;

import org.sortic.sorticproject.Entity.User;

/**
 * 사용자 관련 비즈니스 로직을 정의하는 서비스 인터페이스
 * 사용자 등록, 아이디 중복 확인 등의 기능을 제공
 *
 * [데이터 흐름 요약]
 * 1. 데이터 소스: 
 *    - 프론트엔드에서 전송된 회원가입 요청 데이터
 *    - UserRepository를 통해 조회된 사용자 데이터
 * 2. 데이터 처리:
 *    - 비즈니스 로직 정의 (회원가입, 아이디 중복 확인 등)
 *    - 데이터 유효성 검증
 * 3. 데이터 전달:
 *    - UserServiceImpl 구현체로 처리 위임
 *    - 처리 결과를 Controller로 반환
 */
public interface UserService {
    /**
     * 새로운 사용자를 시스템에 등록
     * 비밀번호는 암호화되어 저장되며, 아이디 중복 검사를 수행
     * 
     * @param user 등록할 사용자 정보를 담은 User 객체
     * @return 등록이 완료된 User 객체 (비밀번호가 암호화된 상태)
     * @throws RuntimeException 이미 존재하는 아이디로 등록을 시도한 경우
     */
    User signup(User user);

    /**
     * 사용자가 입력한 아이디의 중복 여부를 확인
     * 
     * @param username 확인할 아이디
     * @return boolean 사용 가능한 아이디인 경우 true, 이미 존재하는 경우 false
     */
    boolean checkUsername(String username);

    /**
     * 사용자 아이디로 사용자 정보를 조회
     * 
     * @param username 조회할 사용자 아이디
     * @return User 조회된 사용자 정보
     * @throws IllegalArgumentException 존재하지 않는 사용자인 경우
     */
    User findByUsername(String username);

    /**
     * 사용자 아이디의 존재 여부를 확인
     * 
     * @param username 확인할 사용자 아이디
     * @return boolean 아이디가 존재하면 true, 없으면 false
     */
    boolean existsByUsername(String username);
} 