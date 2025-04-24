import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// axios 인스턴스 생성
export const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터 - 토큰 추가
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 토큰 만료 처리
authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // 토큰 만료 시 처리
            localStorage.clear();
            // 로그인 페이지가 아닐 때만 리다이렉트
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (userId, password) => {
  try {
    if (!userId || !password) {
      throw new Error('아이디와 비밀번호를 모두 입력해주세요.');
    }

    // 🔧 수정 1: 'username' 제거 → 서버는 user_id, password만 받도록 설계됨
    const response = await authApi.post('/login', {
      user_id: userId,
      password: password
    });

    if (!response.data) {
      throw new Error('서버로부터 응답을 받지 못했습니다.');
    }

    // 🔧 수정 2: username 응답에서 받아옴 (닉네임 표시용)
    const { token, user_id, username } = response.data;

    if (!token || !user_id) {
      throw new Error('로그인 응답 데이터가 올바르지 않습니다.');
    }

    // 🔧 수정 3: userData에 username 저장 → 헤더에서 닉네임 표시용
    const userData = {
      user_id: user_id,
      username: username || user_id,  // 닉네임 없으면 user_id로 대체
      token: token
    };

    // 🔧 수정 4: username 포함된 user 객체 통째로 localStorage에 저장
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('user', JSON.stringify(userData));

    return {
      user: userData,
      token: token
    };
  } catch (error) {
    console.error('Login error:', error);

    if (error.response) {
      const errorMessage = error.response.data || '서버 오류가 발생했습니다.';
      if (error.response.status === 401) {
        throw new Error(typeof errorMessage === 'string' ? errorMessage : '아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        throw new Error(typeof errorMessage === 'string' ? errorMessage : '서버 오류가 발생했습니다.');
      }
    }

    if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    }

    throw error;
  }
};


// 로그아웃
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    localStorage.removeItem('sidebarCollapsed');
    localStorage.removeItem('sortCategory');
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        return null;
    }
};

// 토큰 유효성 검사
export const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const response = await authApi.post('/validate-token', null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.isValid;
    } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user');
        return false;
    }
};
