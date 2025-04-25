import axios from 'axios';

// axios 인스턴스 생성
const authApi = axios.create({
    baseURL: 'http://localhost:8080/api/auth',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// 요청 인터셉터
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Interceptor - Token from localStorage:', token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Interceptor - Added Authorization header');
        } else {
            console.log('Interceptor - No token found, skipping Authorization header');
        }

        console.log('Interceptor - Final request config:', config);
        return config;
    },
    (error) => {
        console.error('Interceptor - Request error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
authApi.interceptors.response.use(
    (response) => {
        console.log('Interceptor - Response:', response);
        return response;
    },
    (error) => {
        console.error('Interceptor - Response error:', error);
        return Promise.reject(error);
    }
);

export const login = async (inputUserId, password) => {
  try {
    if (!inputUserId || !password) {
      throw new Error('아이디와 비밀번호를 모두 입력해주세요.');
    }

    const response = await axios.post('http://localhost:8080/api/auth/login', {
      userId: inputUserId,
      password: password
    });

    console.log('Login response:', response.data);

    if (!response.data) {
      throw new Error('서버로부터 응답을 받지 못했습니다.');
    }

    const { token, user } = response.data;
    console.log('Received token:', token);
    console.log('Received user:', user);

    if (!token || !user) {
      throw new Error('로그인 응답 데이터가 올바르지 않습니다.');
    }

    // 토큰에서 공백 제거 후 저장
    const cleanToken = token.trim();
    localStorage.setItem('token', cleanToken);
    console.log('Token saved to localStorage:', localStorage.getItem('token'));

    // 사용자 데이터 구조화 (토큰은 제외)
    const userData = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      grade: user.grade
    };

    // 사용자 정보 저장
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('user', JSON.stringify(userData));

    return {
      user: userData,
      token: cleanToken
    };
  } catch (error) {
    console.error('Login error:', error);

    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data || '서버 오류가 발생했습니다.';
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
    localStorage.removeItem('userId');
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
    console.log('Validating token from localStorage:', token); // 저장된 토큰 확인

    if (!token) {
        console.log('No token found in localStorage');
        return false;
    }

    try {
        // 요청 전 헤더 확인
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        console.log('Request headers:', headers); // 요청 헤더 확인

        // 인터셉터에서 이미 Authorization 헤더를 추가하므로, 여기서는 추가하지 않음
        const response = await authApi.post('/validate-token');
        console.log('Token validation response:', response.data); // 검증 응답 확인

        // 응답이 없거나 유효하지 않은 경우
        if (!response.data || response.data.error) {
            console.error('Invalid token response:', response.data);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Token validation error:', error);
        console.error('Error response:', error.response?.data); // 에러 응답 상세 확인

        // 토큰이 유효하지 않은 경우에만 로컬 스토리지 클리어
        if (error.response?.status === 400 || error.response?.status === 401) {
            console.log('Clearing localStorage due to invalid token');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
        }
        return false;
    }
};
