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

    @Select("""
    -- 중복되지 않는 sorter_name을 가져옵니다.
    SELECT sorter_id, sorter_name, user_id, sorter_number
    FROM Sorter
    WHERE user_id = #{user_id}
    AND sorter_name NOT IN (
        SELECT sorter_name
        FROM Sorter
        WHERE user_id = #{user_id}
        GROUP BY sorter_name
        HAVING COUNT(sorter_name) > 1
    )

    UNION ALL

    -- 중복되는 sorter_name은 하나만 가져옵니다.
    SELECT MIN(sorter_id) AS sorter_id, sorter_name, user_id, MIN(sorter_number) AS sorter_number
    FROM Sorter
    WHERE user_id = #{user_id}
    AND sorter_name IN (
        SELECT sorter_name
        FROM Sorter
        WHERE user_id = #{user_id}
        GROUP BY sorter_name
        HAVING COUNT(sorter_name) > 1
    )
    GROUP BY sorter_name, user_id
    ORDER BY sorter_number ASC
""")
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

    @Update("UPDATE Sorter SET sorter_name = #{sorter_name} WHERE sorter_name = #{old_sorter_name}")
    int updateSorterName(@Param("old_sorter_name") String old_sorter_name, @Param("sorter_name") String sorter_name);
    @Select("SELECT * FROM Sorter WHERE sorter_name = #{sorter_name}")
    List<Sorter> findAllByName(@Param("sorter_name") String sorterName);



    @Delete({
        "<script>",
        "DELETE FROM Element",
        "WHERE elements_name_id IN",  // elements_name_id로 삭제하려는 경우 변경
        "(SELECT elements_id FROM Sorter WHERE sorter_name = #{sorterName})",
        "AND elements_name_id IN",   // 요소 ID로 필터링
        "<foreach item='id' collection='elementIds' open='(' separator=',' close=')'>",
        "#{id}",                     // elementIds로 넘어온 ID
        "</foreach>",
        "</script>"
    })
    void deleteElementsBySorterNameAndIds(@Param("sorterName") String sorterName, @Param("elementIds") List<Integer> elementIds);

    @Update("UPDATE Sorter SET elements_id = #{elements_id} WHERE sorter_id = #{sorter_id}")
    void updateElementsId(@Param("sorter_id") int sorter_id, @Param("elements_id") int elements_id);

    @Select("SELECT sorter_name FROM Sorter WHERE sorter_id = #{sorter_id}")
    String getSorterNameById(@Param("sorter_id") int sorter_id);


    @Select("SELECT elements_id FROM Sorter WHERE sorter_name = #{sorter_name}")
    List<Integer> getElementsIdBySorterName(@Param("sorter_name") String sorterName);


    // 사용자별 최대 sorter_number 조회
    @Select("SELECT MAX(sorter_number) FROM sorter WHERE user_id = #{user_id}")
    int getMaxSorterNumberByUserId(String user_id);
    // 요소를 sorter에 추가하는 쿼리
    // sorter_name으로 정렬자 찾기
    @Select("SELECT * FROM Sorter WHERE sorter_name = #{sorterName}")
    Sorter findSorterByName(@Param("sorterName") String sorterName);


    @Select("SELECT COUNT(*) > 0 FROM Sorter WHERE sorter_name = #{sorterName} AND elements_id = #{elementsId}")
    boolean existsElementInSorterByName(String sorterName, int elementsId);


    // addElementToSorter 메서드에서 중복을 처리
    @Insert("INSERT INTO Sorter (user_id, elements_id, sorter_number, sorter_name) " +
        "VALUES (#{user_id}, #{elements_id}, #{sorter_number}, #{sorter_name})")
    void addElementToSorter(Sorter newSorter);

    @Select("SELECT COUNT(*) FROM sorter WHERE sorter_id = #{sorterId} AND elements_id = #{elementsId}")
    int countElementInSorter(@Param("sorterId") int sorterId, @Param("elementsId") int elementsId);

}



