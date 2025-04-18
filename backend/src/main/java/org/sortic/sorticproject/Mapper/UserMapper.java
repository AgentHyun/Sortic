package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.sortic.sorticproject.Entity.User;
import java.util.Optional;

/**
 * [데이터 흐름 요약]
 * 1. 데이터 소스: User 엔티티와 매핑된 데이터베이스 테이블
 * 2. 데이터 처리:
 *    - MyBatis XML 매핑을 통한 SQL 쿼리 실행
 *    - UserMapper.xml에 정의된 SQL문과 매핑
 * 3. 데이터 전달:
 *    - UserService로 데이터 전달
 *    - Optional을 사용하여 null-safe한 데이터 전달 보장
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
     * @param username 조회할 사용자 아이디
     * @return Optional<User> 사용자 정보가 없을 수 있으므로 Optional로 감싸서 반환
     */
    Optional<User> findByUsername(String username);

    /**
     * 사용자 아이디의 존재 여부를 확인
     * @param username 확인할 사용자 아이디
     * @return boolean 아이디가 존재하면 true, 없으면 false
     */
    boolean existsByUsername(String username);
} 