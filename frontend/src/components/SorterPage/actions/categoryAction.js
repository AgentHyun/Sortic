import axios from 'axios';
import {atom, useAtom} from 'jotai';
import { message } from 'antd';
import {
  categoriesAtom,
  currentCategoryAtom,
  currentCategoryNameAtom,
  newCategoryAtom,
  isEditingCategoryAtom,
  newCategoryNameAtom,
  addCategoryModalVisibleAtom,
  cardsAtom,
  messageAtom,
  currentIndexAtom, selectedUserIdAtom
} from '../atoms/atoms';
import { userIdAtom, userAtom  } from '../../../Atoms/userAtom';
import { fetchElementsByCategoryAction } from './elementAction';
import { authUserAtom } from '../../../auth/authAtoms';
export const fetchAndNumberCategoriesAction = atom(
  null,
  async (get, set) => {
    try {
      // ✅ 무조건 초기화
      set(categoriesAtom, []);
      set(currentCategoryAtom, null);
      set(currentCategoryNameAtom, '');
      set(currentIndexAtom, -1);

      const userId = get(selectedUserIdAtom);
      if (!userId) {
        console.warn("유저 ID 없음: 카테고리 조회 생략");
        return [];
      }

      const response = await axios.get('http://localhost:8080/api/categories/get_category', {
        params: { user_id: userId }
      });

      const categories = response.data;

      // ✅ 카테고리가 아예 없으면 조기 종료 (이후 로직 실행 X)
      if (!categories || categories.length === 0) {
        console.log('📭 카테고리 없음 → 상태 초기화 유지');
        return [];
      }

      // ✅ 번호 붙이기
      const numberedCategories = categories.map((category, index) => ({
        ...category,
        number: index + 1,
      }));

      set(categoriesAtom, numberedCategories);

      const currentCategoryId = get(currentCategoryAtom);

      if (!currentCategoryId && numberedCategories.length > 0) {
        const firstCategory = numberedCategories[0];
        set(currentCategoryAtom, firstCategory.category_id);
        set(currentCategoryNameAtom, firstCategory.category_name);
        set(currentIndexAtom, 0);
        await set(fetchElementsByCategoryAction, firstCategory.category_id);
      } else if (currentCategoryId) {
        const currentIndex = numberedCategories.findIndex(cat => cat.category_id === currentCategoryId);
        if (currentIndex !== -1) {
          set(currentIndexAtom, currentIndex);
          set(currentCategoryNameAtom, numberedCategories[currentIndex].category_name);
        }
      }

      return numberedCategories;
    } catch (error) {
      console.error('🚨 카테고리 조회 실패:', error);
      message.error('카테고리 조회에 실패했습니다.');
      return [];
    }
  }
);

export const fetchCategoriesAction = atom(
    null,
    async (get, set, user_id) => {
        try {
          const userId = get(selectedUserIdAtom);

            const response = await axios.get('http://localhost:8080/api/categories/get_category', {
                params: { user_id: userId }
            });
            set(categoriesAtom, response.data);
            return response.data; // ✅ 최신 카테고리 목록 반환 추가
        } catch (error) {
            console.error('카테고리 불러오기 실패', error);
            set(messageAtom, { type: 'warning', content: '카테고리 불러오기 실패' });
            return []; // 🚨 에러 발생 시 빈 배열 반환 (undefined 방지)
        }
    }
);


export const fetchCategoryByIdAction = atom(
    null,
    async (get, set, categoryId) => {
      const userId = get(selectedUserIdAtom);
        if (userId) {
            message.error('로그인이 필요합니다.');
            return;
        }
        try {
            // API 호출 (user_id와 category_id를 params로 전달)
            const response = await axios.get('http://localhost:8080/api/categories/get_category_by_id', {
                params: {
                    user_id: userId,
                    category_id: categoryId,
                },
            });

            console.log("API 응답 데이터:", response.data);  // 디버깅용 콘솔 로그

            if (response.data) {
                const category = response.data;

                // 카테고리 목록 상태에서 해당 category_id를 찾아 업데이트
                set(categoriesAtom, (prevCategories) => {
                    // 중복 카테고리 처리 (기존 카테고리와 ID가 동일하면 업데이트)
                    const existingCategories = prevCategories.map((cat) => cat.category_id);
                    if (!existingCategories.includes(category.category_id)) {
                        return [...prevCategories, category];  // 중복되지 않으면 추가
                    } else {
                        return prevCategories.map((cat) =>
                            cat.category_id === category.category_id ? { ...cat, ...category } : cat
                        );  // 중복되면 해당 카테고리만 갱신
                    }
                });

                // 카테고리 ID와 이름을 상태에 저장
                set(currentCategoryAtom, category.category_id);
                set(currentCategoryNameAtom, category.category_name);

            } else {
                console.error("카테고리 데이터가 없습니다.");
            }
        } catch (error) {
            console.error('카테고리 상세 정보 로드 실패:', error);
        }
    }
);

export const fetchFirstCategoryAction = atom(
    null,
    async (get, set, user_id) => {
        try {
          const userId = get(selectedUserIdAtom);
            const response = await axios.get('http://localhost:8080/api/categories/get_first_category', {
                params: { user_id: userId }
            });

            if (response.data) {
                const firstCategory = response.data;

                // 첫 번째 카테고리 상태 업데이트
                set(currentCategoryAtom, firstCategory.category_id);
                set(currentCategoryNameAtom, firstCategory.category_name);
                console.log("첫번쨰 카테고리" + get(currentCategoryAtom));
                // 카테고리 목록에 첫 번째 카테고리 추가 (중복되지 않게 처리)
                set(categoriesAtom, (prevCategories) => {
                    // 중복 체크 후 카테고리 추가
                    const categoryExists = prevCategories.some(
                        (category) => category.category_id === firstCategory.category_id
                    );
                    if (!categoryExists) {
                        return [...prevCategories, firstCategory];
                    }
                    return prevCategories;
                });

                // 해당 카테고리의 요소를 불러오기
                set(fetchElementsByCategoryAction, firstCategory.category_id); // 요소 불러오기 액션 호출

            } else {
                console.error('첫 번째 카테고리를 찾을 수 없습니다.');
                set(messageAtom, { type: 'warning', content: '첫 번째 카테고리를 찾을 수 없습니다.' });
            }
        } catch (error) {
            console.error('첫 번째 카테고리 조회 실패:', error);
            set(messageAtom, { type: 'warning', content: '첫 번째 카테고리 조회 실패' });
        }
    }
);
// 카테고리 추가
export const handleCategoryOkAction = atom(
    null,
    async (get, set) => {
        const newCategory = get(newCategoryAtom);
      const userId = get(selectedUserIdAtom);


        if (!newCategory) {
            message.warning('카테고리 이름을 입력하세요.');
            return;
        }


        if (!userId) {
            message.error('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/categories/add_category', {
              user_id: userId,
                category_name: newCategory,
            });

            if (!response.data) {
                throw new Error('서버에서 응답을 받지 못했습니다.');
            }

            const addedCategory = response.data;

            // 현재 카테고리 목록 가져오기
            const currentCategories = get(categoriesAtom);

            // 새 카테고리를 목록에 추가
            const updatedCategories = [...currentCategories, addedCategory];

            // 상태 업데이트
            set(categoriesAtom, updatedCategories);
            set(currentCategoryAtom, addedCategory.category_id);
            set(currentCategoryNameAtom, addedCategory.category_name);

            message.success('카테고리가 추가되었습니다!');

            return addedCategory;
        } catch (error) {
            console.error('카테고리 추가 실패:', error);
            message.error('카테고리 추가에 실패했습니다.');
            throw error;
        }
    }
);


export const deleteCategoryAction = atom(
    null,
    async (get, set) => {
        const currentCategory = get(currentCategoryAtom);
        const currentCategoryName = get(currentCategoryNameAtom);
        const categories = get(categoriesAtom);

        if (!currentCategory) {
            set(messageAtom, { type: 'warning', content: '삭제할 카테고리를 선택해주세요.' });
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/categories/delete_category', {
                category_id: currentCategory,
            });


            message.success(`"${currentCategoryName}"을(를) 성공적으로 삭제했습니다.`);
            // 삭제된 카테고리의 인덱스 찾기
            const indexToDelete = categories.findIndex(cat => cat.category_id === currentCategory);
            if (indexToDelete === -1) return;

            // 새로운 카테고리 목록 생성 (삭제된 카테고리 제외)
            const updatedCategories = categories.filter(cat => cat.category_id !== currentCategory)
                .map((cat, index) => ({ ...cat, number: index + 1 })); // 인덱스 재조정

            set(categoriesAtom, updatedCategories);

            // 새로운 선택된 카테고리 설정 (가능하면 바로 뒤의 카테고리 선택)
            let newIndex = indexToDelete < updatedCategories.length ? indexToDelete : updatedCategories.length - 1;
            let newCategory = updatedCategories[newIndex] || null;

            if (newCategory) {
                set(currentCategoryAtom, newCategory.category_id);
                set(currentCategoryNameAtom, newCategory.category_name);
                set(currentIndexAtom, newIndex); // ✅ 인덱스 업데이트
            } else {
                set(currentCategoryAtom, null);
                set(currentCategoryNameAtom, '');
                set(cardsAtom, []);
                set(currentIndexAtom, -1); // ✅ 선택할 카테고리가 없으면 -1 설정
            }
        } catch (error) {
            set(messageAtom, { type: 'warning', content: '카테고리 삭제 실패!' });
            console.error(error);
        }
    }
);

// 카테고리 이름 변경
export const handleCategoryNameSaveAction = atom(
    null,
    async (get, set) => {
        const newCategoryName = get(newCategoryNameAtom);
        const currentCategory = get(currentCategoryAtom);

        if (!newCategoryName) {
            set(messageAtom, { type: 'warning', content: '카테고리 이름을 입력하세요.' });
            return;
        }

        try {
            await axios.put(
                `http://localhost:8080/api/categories/update_category_name`,
                { category_id: currentCategory, category_name: newCategoryName }, // ✅ data로 전달
                {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' } // ✅ UTF-8 명시
                }
            );


            set(messageAtom, { type: 'success', content: '카테고리 이름이 업데이트되었습니다!' });
            set(currentCategoryNameAtom, newCategoryName);
            set(isEditingCategoryAtom, false);
            message.success("수정이 완료되었습니다!")
        } catch (error) {
            set(messageAtom, { type: 'warning', content: '카테고리 이름 업데이트 실패!' });
            console.error(error);
        }
    }
);

// 카테고리 이름 더블클릭 시 수정 모드 활성화
export const handleCategoryNameDoubleClickAction = atom(
    null,
    (get, set) => {
        const currentCategoryName = get(currentCategoryNameAtom);
        set(isEditingCategoryAtom, true);
        set(newCategoryNameAtom, currentCategoryName);
    }
);

// 카테고리 변경 (이전/다음 카테고리)
export const changeCategoryAction = atom(
    null,
    (get, set, direction) => {
        const categories = get(categoriesAtom);
        const currentCategoryId = get(currentCategoryAtom);

        if (!categories || categories.length === 0) {
            console.error("🚨 카테고리 목록이 없습니다.");
            set(messageAtom, { type: 'warning', content: '카테고리 목록이 없습니다!' });
            return;
        }

        if (!currentCategoryId) {
            console.error("🚨 현재 선택된 카테고리가 없습니다.");
            set(currentCategoryAtom, categories[0]?.category_id || null);
            set(currentCategoryNameAtom, categories[0]?.category_name || "로딩중..");
            return;
        }

        const currentIndex = categories.findIndex(cat => cat.category_id === currentCategoryId);

        if (currentIndex === -1) {
            console.error("🚨 현재 선택된 카테고리를 찾을 수 없습니다.");
            set(currentCategoryAtom, categories[0]?.category_id || null);
            set(currentCategoryNameAtom, categories[0]?.category_name || "로딩중..");
            return;
        }

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % categories.length; // 마지막 카테고리 → 첫 번째로 이동
        } else if (direction === 'prev') {
            newIndex = (currentIndex - 1 + categories.length) % categories.length; // 첫 번째 카테고리 → 마지막으로 이동
        } else {
            console.error("🚨 잘못된 direction 값:", direction);
            return;
        }

        const newCategory = categories[newIndex];

        if (!newCategory) {
            console.error("🚨 새로운 카테고리가 존재하지 않습니다!");
            return;
        }

        set(currentIndexAtom, newIndex);
        set(currentCategoryAtom, newCategory.category_id);
        set(currentCategoryNameAtom, newCategory.category_name);
    }
);

export const fetchCategoryCountAction = atom(
    null,
    async (get, set, user_id) => {
        try {
          const userId = get(selectedUserIdAtom);
            const response = await axios.get('http://localhost:8080/api/categories/count_categories', {
                params: { user_id: userId }
            });

            const count = response.data;

            console.log(`📊 ${user_id}의 카테고리 개수:`, count);

            return count;
        } catch (error) {
            console.error('카테고리 개수 조회 실패:', error);
            set(messageAtom, { type: 'warning', content: '카테고리 개수 조회 실패' });
            return 0; // 에러 발생 시 기본값 0 반환
        }
    }
);





