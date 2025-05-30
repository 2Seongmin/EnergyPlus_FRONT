import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getKakaoLoginURL } from "../../services/authService";
import {
  LoginContainer,
  LoginBox,
  LoginTitle,
  Form,
  InputField,
  LoginButton,
  LinkContainer,
  LinkItem,
  Separator,
  ErrorMessage,
  SocialLoginSection,
  KakaoLoginButton,
  Divider,
} from "./LoginForm.styles";

import kakaoLogo from "../../assets/kakao_logo.png";

const LoginForm = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 일반 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();

    //폼 유효성 검사
    if (!userEmail.trim() || !userPassword.trim()) {
      setErrorMsg("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // 로그인 서비스 호출
      const data = await login(userEmail, userPassword);

      // 토큰 저장
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);

      // 사용자 정보 저장
      sessionStorage.setItem("userEmail", data.userEmail);
      sessionStorage.setItem("userName", data.userName);
      sessionStorage.setItem("userRole", data.userRole);

      // 로그인 상태변경 이벤트 발생
      window.dispatchEvent(new Event("loginStateChanged"));

      alert(data.userName + "님 환영합니다!");

      // 역할에 따라 리다이렉트
      if (data.userRole === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrorMsg(
        error.response?.data?.error ||
          "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      // 서비스 함수를 사용하여 카카오 로그인 URL 가져오기
      const kakaoAuthURL = await getKakaoLoginURL();
      window.location.href = kakaoAuthURL;
    } catch (error) {
      console.error("카카오 로그인 URL 가져오기 오류:", error);
      setErrorMsg("카카오 로그인 서비스를 이용할 수 없습니다.");
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LoginTitle>로그인</LoginTitle>

        {/* 일반 로그인 폼 */}
        <Form onSubmit={handleLogin}>
          {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

          <InputField
            type="email"
            placeholder="이메일"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            disabled={isLoading}
          />

          <InputField
            type="password"
            placeholder="비밀번호"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            disabled={isLoading}
          />

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? "로그인 중" : "로그인"}
          </LoginButton>
        </Form>

        {/* 링크 섹션 */}
        <LinkContainer>
          <LinkItem onClick={() => navigate("/find-password")}>
            비밀번호 찾기
          </LinkItem>
          <Separator>|</Separator>
          <LinkItem onClick={() => navigate("/agreement")}>회원가입</LinkItem>
        </LinkContainer>

        {/* 구분선 */}
        <Divider>
          <span>또는</span>
        </Divider>

        {/* 소셜 로그인 섹션 */}
        <SocialLoginSection>
          <KakaoLoginButton
            src={kakaoLogo}
            onClick={handleKakaoLogin}
            disabled={isLoading}
          />
        </SocialLoginSection>
      </LoginBox>
    </LoginContainer>
  );
};

export default LoginForm;
