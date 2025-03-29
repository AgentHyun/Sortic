import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/categories";

export const fetchMaxCategoryId = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/max_category_id`);
        return response.data;
    } catch (error) {
        console.error("최대 카테고리 ID 조회 실패:", error);
        return null;
    }
};

export const fetchMinCategoryId = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/min_category_id`);
        return response.data;
    } catch (error) {
        console.error("최소 카테고리 ID 조회 실패:", error);
        return null;
    }
};

export const addCategory = async (categoryName) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add_category`, {
            user_id: "user123",
            category_name: categoryName
        });
        return response.data;
    } catch (error) {
        console.error("카테고리 추가 실패:", error);
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        await axios.post(`${API_BASE_URL}/delete_category`, null, {
            params: { category_id: categoryId }
        });
    } catch (error) {
        console.error("카테고리 삭제 실패:", error);
        throw error;
    }
};
