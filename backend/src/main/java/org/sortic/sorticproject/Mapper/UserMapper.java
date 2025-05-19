package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import org.sortic.sorticproject.Entity.Users;


import java.util.Optional;

@Repository
public interface UserMapper {

    /** ✅ user_id 중복 확인 */
    @Select("SELECT COUNT(*) > 0 FROM Users WHERE user_id = #{userId}")
    boolean existsByUserId(@Param("userId") String userId);

    /** ✅ storeName(상호명) 중복 확인 */
    @Select("SELECT COUNT(*) > 0 FROM Users WHERE store_name = #{storeName}")
    boolean existsByStoreName(@Param("storeName") String storeName);

    /** ✅ 이메일과 상호명으로 userId 조회 (미구현)  */
    @Select("SELECT user_id FROM Users WHERE email = #{email} AND store_name = #{storeName}")
    Optional<String> findUserIdByEmailAndStoreName(@Param("email") String email, @Param("storeName") String storeName);

    /** ✅ 사용자 업장 이미지 경로 업데이트 */
    @Update("UPDATE Users SET profile_image = #{imageUrl} WHERE user_id = #{userId}")
    void updateStoreImage(@Param("userId") String userId, @Param("imageUrl") String imageUrl);

    /** ✅ 사용자 주소 정보 업데이트 */
    @Update("UPDATE Users SET zipcode = #{zipcode}, road_address = #{roadAddress}, detail_address = #{detailAddress} WHERE user_id = #{userId}")
    void updateUserAddress(@Param("userId") String userId,
                           @Param("zipcode") String zipcode,
                           @Param("roadAddress") String roadAddress,
                           @Param("detailAddress") String detailAddress);
    /** ✅ userId로 사용자 조회 */
    @Select("SELECT * FROM Users WHERE user_id = #{userId}")
    Users findByUserId(@Param("userId") String userId);

    /** ✅ 사용자 삽입 (회원가입) */
    @Insert("INSERT INTO Users (user_id, password, store_name, email, phone, grade, region, profile_image) " +
        "VALUES (#{userId}, #{password}, #{store_name}, #{email}, #{phone}, #{grade}, #{region}, #{profile_image})")
    void insertUser(Users user);
}
