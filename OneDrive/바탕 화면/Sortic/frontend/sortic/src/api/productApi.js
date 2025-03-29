import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/elements";

export const fetchElementsByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get_elements_by_category`, {
            params: { category_id: categoryId }
        });
        return response.data;
    } catch (error) {
        console.error("카테고리 요소 조회 실패:", error);
        return [];
    }
};

export const addProduct = async (product) => {
    try {
        await axios.post(`${API_BASE_URL}/add_element`, product);
    } catch (error) {
        console.error("상품 추가 실패:", error);
        throw error;
    }
};
