package org.sortic.sorticproject.Mapper;

import org.apache.ibatis.annotations.*;
import org.sortic.sorticproject.Entity.Sorter;

import java.util.List;

@Mapper
public interface SorterMapper {

    // 정렬자 추가
    @Insert("INSERT INTO Sorter (user_id, elements_id, sorter_number, sorter_name) " +
            "VALUES (#{user_id}, #{elements_id}, #{sorter_number}, #{sorter_name})")
    @Options(useGeneratedKeys = true, keyProperty = "sorter_id")
    void insertSorter(Sorter sorter);

    // 정렬자 조회
    @Select("SELECT * FROM Sorter WHERE sorter_id = #{sorter_id}")
    Sorter getSorterById(int sorter_id);

    // 사용자별 정렬자 목록 조회
    @Select("SELECT * FROM Sorter WHERE user_id = #{user_id} ORDER BY sorter_number ASC")
    List<Sorter> getSortersByUserId(String user_id);

    // 정렬자 수정
    @Update("UPDATE Sorter SET sorter_name = #{sorter_name}, elements_id = #{elements_id}, sorter_number = #{sorter_number} " +
            "WHERE sorter_id = #{sorter_id}")
    void updateSorter(@Param("sorter_id") int sorter_id,
                      @Param("sorter_name") String sorter_name,
                      @Param("elements_id") int elements_id,
                      @Param("sorter_number") int sorter_number);

    // 정렬자 삭제
    @Delete("DELETE FROM Sorter WHERE sorter_id = #{sorter_id}")
    void deleteSorter(int sorter_id);

    // 사용자별 정렬자 전체 삭제
    @Delete("DELETE FROM Sorter WHERE user_id = #{user_id}")
    void deleteAllSortersForUser(String user_id);

    @Update("UPDATE Sorter SET sorter_name = #{sorter_name} WHERE sorter_id = #{sorter_id}")
    void updateSorterName(@Param("sorter_id") int sorter_id, @Param("sorter_name") String sorter_name);

}
