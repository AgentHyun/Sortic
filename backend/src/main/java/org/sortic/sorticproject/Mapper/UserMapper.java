package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.Users;
import org.apache.ibatis.annotations.Param;

/**
 * [데이터 흐름 요약]
 * 1. 데이터 소스: Users 엔티티와 매핑된 데이터베이스 테이블
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
    @Insert("INSERT INTO Users (user_id, password, username, phone, email, region, grade) " +
            "VALUES (#{userId}, #{password}, #{username}, #{phone}, #{email}, #{region}, #{grade})")
    void insertUser(Users user);

    /**
     * 사용자 아이디로 사용자 정보를 조회
     * @param userId 조회할 사용자 아이디
     * @return Users 사용자 정보
     */
    @Select("SELECT user_id AS userId, password, username, phone, email, region, " +
            "profile_image, grade, created_signup_time " +
            "FROM Users WHERE user_id = #{userId}")
    Users findByUserId(String userId);

    /**
     * 사용자 아이디의 존재 여부를 확인
     * @param userId 확인할 사용자 아이디
     * @return boolean 아이디가 존재하면 true, 없으면 false
     */
    @Select("SELECT COUNT(*) > 0 FROM Users WHERE user_id = #{userId}")
    boolean existsByUserId(String userId);

    /**
     * 이메일의 존재 여부를 확인
     * @param email 확인할 이메일
     * @return boolean 이메일이 존재하면 true, 없으면 false
     */
    @Select("SELECT COUNT(*) > 0 FROM Users WHERE email = #{email}")
    boolean existsByEmail(String email);

    /**
     * 프로필 이미지 업데이트
     * @param userId 사용자 아이디
     * @param profileImage 프로필 이미지 URL
     */
    @Update("UPDATE Users SET profile_image = #{profileImage} WHERE user_id = #{userId}")
    void updateProfileImage(@Param("userId") String userId, @Param("profileImage") String profileImage);

    /**
     * 사용자 정보 업데이트 (프로필 이미지 포함)
     * @param user 업데이트할 사용자 정보
     */
    @Update("UPDATE Users SET phone = #{phone}, email = #{email}, region = #{region} " +
            "WHERE user_id = #{userId}")
    void updateUserProfile(Users user);

    /**
     * 비밀번호 업데이트
     * @param userId 사용자 아이디
     * @param password 새 비밀번호
     */
    @Update("UPDATE Users SET password = #{password} WHERE user_id = #{userId}")
    void updatePassword(@Param("userId") String userId, @Param("password") String password);

    /**
     * 이메일로 사용자 조회
     * @param email 사용자 이메일
     * @return Users 사용자 정보
     */
    @Select("SELECT user_id, password, username, phone, email, region, " +
            "profile_image, grade, created_signup_time " +
            "FROM Users WHERE email = #{email}")
    Users findByEmail(String email);

    /**
     * 이메일과 사용자 이름으로 사용자 조회
     * @param email 사용자 이메일
     * @param username 사용자 이름
     * @return Users 사용자 정보
     */
    @Select("SELECT user_id, password, username, phone, email, region, " +
            "profile_image, grade, created_signup_time " +
            "FROM Users WHERE email = #{email} AND username = #{username}")
    Users findByEmailAndUsername(@Param("email") String email, @Param("username") String username);
}
