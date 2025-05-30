import axios from "axios";

const API_URL = window.ENV?.API_URL || "http://localhost:80";

// 로그인 상태 확인
export const checkAuthStatus = () => {
  const token = sessionStorage.getItem("accessToken");
  return !!token;
};

// 일반 로그인
export const login = (userEmail, userPassword) => {
  return axios
    .post(`${API_URL}/auth/login`, {
      userEmail,
      userPassword,
    })
    .then((response) => {
      // 성공 -> 응답데이터 반환
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

// 카카오 로그인 URL 가져오기
export const getKakaoLoginURL = () => {
  // 백엔드에서 카카오 로그인 URL 가져오기
  return axios
    .get(`${API_URL}/oauth2/kakao/url`)
    .then((response) => {
      // 성공시 로그인 URL 반환
      return response.data.loginUrl;
    })
    .catch((error) => {
      const KAKAO_CLIENT_ID = window.ENV?.KAKAO_CLIENT_ID;
      const KAKAO_REDIRECT_URI = window.ENV?.KAKAO_REDIRECT_URI;

      const backupUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        KAKAO_REDIRECT_URI
      )}&response_type=code`;
      return backupUrl;
    });
};

// 카카오 로그인 처리
export const processKakaoLogin = (code) => {
  // 백엔드에 카카오 인증코드 전송
  return axios
    .get(`${API_URL}/oauth2/kakao/callback?code=${code}`)
    .then((response) => {
      // 성공 -> 사용자 정보 반환
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

// 로그아웃
export const logout = () => {
  const token = sessionStorage.getItem("accessToken");

  // 토큰이 있는 경우 백엔드에 로그아웃 요청
  if (token) {
    return axios
      .post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        // 성공 ->세션 스토리지 클리어
        clearAuthData();
      });
  }
};

// 인증 데이터 w제거
const clearAuthData = () => {
  // sessionStorage에서 모든 인증 관련 데이터 제거
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("userEmail");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userRole");

  // 로그인 상태 변경 이벤트 발생
  window.dispatchEvent(new Event("loginStateChanged"));
};

// 사용자 정보 가져오기
export const getCurrentUser = () => {
  return {
    email: sessionStorage.getItem("userEmail"),
    name: sessionStorage.getItem("userName"),
    role: sessionStorage.getItem("userRole"),
  };
};

// 토큰 갱신 함수(배포 환경에서 토큰 만료 시 이 함수 사용하기 위함)
export const refreshToken = () => {
  // 저장된 리프레시 토큰 가져오기
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("리프레시 토큰이 없습니다.");
  }

  // 백엔드에 토큰 갱신 요청
  return axios
    .post(`${API_URL}/auth/refresh`, {
      refreshToken: refreshToken,
    })
    .then((response) => {
      // 새로운 토큰을 세션에 저장
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      sessionStorage.setItem("accessToken", accessToken);
      if (newRefreshToken) {
        sessionStorage.setItem("refreshToken", newRefreshToken);
      }
      return response.data;
    })
    .catch((error) => {
      // 토큰 갱신 실패 -> 로그아웃
      clearAuthData();
      throw error;
    });
};