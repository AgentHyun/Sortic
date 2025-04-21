package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.sortic.sorticproject.Entity.User;

/**
 * [데이터 흐름 요약]
 * 1. 데이터 소스: User 엔티티와 매핑된 데이터베이스 테이블
 * 2. 데이터 처리:
 *    - MyBatis XML 매핑을 통한 SQL 쿼리 실행
 *    - UserMapper.xml에 정의된 SQL문과 매핑
 * 3. 데이터 전달:
 *    - UserService로 데이터 전달
 */
@Mapper
public interface UserMapper {
    /**
     * 사용자 정보를 데이터베이스에 저장
     * @param user 저장할 사용자 정보
     */
    void save(User user);

    /**
     * 사용자 아이디로 사용자 정보를 조회
     * @param userId 조회할 사용자 아이디
     * @return User 사용자 정보
     */
    User findByUserId(String userId);

    /**
     * 사용자 아이디의 존재 여부를 확인
     * @param userId 확인할 사용자 아이디
     * @return boolean 아이디가 존재하면 true, 없으면 false
     */
    boolean existsByUserId(String userId);

    /**
     * 이메일의 존재 여부를 확인
     * @param email 확인할 이메일
     * @return boolean 이메일이 존재하면 true, 없으면 false
     */
    boolean existsByEmail(String email);
} 