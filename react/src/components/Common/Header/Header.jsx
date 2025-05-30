import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LogoImg from "../../../assets/img/Logo.png";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navi = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // 나의 다짐
  const [userPromise, setUserPromise] = useState("");

  // 나의 다짐 조회
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      setUserPromise("");
      return;
    }

    axios
      .get("http://localhost/promise/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserPromise(response.data.userPromise || "");
      })
      .catch((error) => {
        console.error("나의 다짐 불러오기 실패", error);
        setUserPromise("");
      });
  }, [isLoggedIn]);

  
  useEffect(() => {
    // 초기 로그인 상태 확인
    checkLoginStatus();

    // 로그인상태 변경 이벤트 리스너 등록
    window.addEventListener("loginStateChanged", checkLoginStatus);

    // 컴포넌트가 DOM에서 제거 -> 이벤트 리스너 제거
    return () => {
      window.removeEventListener("loginStateChanged", checkLoginStatus);
    };
  }, []);

  // 로그인 상태 확인 함수
  const checkLoginStatus = () => {
    const token = sessionStorage.getItem("accessToken");
    const storedUserName = sessionStorage.getItem("userName");

    if (token && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // t세션에서 토큰 및 사용자 정보 제거
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userName");

    // 로그인 상태 업데이트
    setIsLoggedIn(false);
    setUserName("");

    // 로그인 상태 변경 이벤트 발생
    window.dispatchEvent(new Event("loginStateChanged"));

    alert("로그아웃 되었습니다.");

    // 홈 페이지로 이동
    navi("/");
  };

  return (
    <>
      <div className="header">
        <div className="header-container">
          <a href="/" className="logo">
            <img src={LogoImg} alt="에너지 생활+ 로고" />
          </a>

          {/* 나의 다짐 불러오기 */}
          <div className="slogan-wrap">
            {userPromise ? (
              <span>{userPromise}</span> // 다짐 있을 때
            ) : (
              <span>탄소 중립 실천 다짐을 작성해주세요</span>
            )}
          </div>

          <ul className="header-link">
            {isLoggedIn ? (
              // 로그인 상태일 때
              <>
                <li className="link-item welcome-text">
                  <span>{userName}님</span>
                </li>
                <li className="link-item">
                  <span onClick={handleLogout}>로그아웃</span>
                </li>
                <li className="link-item">
                  <span onClick={() => navi("/mypage_main")}>마이페이지</span>
                </li>
              </>
            ) : (
              // 로그아웃 상태일 때
              <>
                <li className="link-item">
                  <span onClick={() => navi("/login")}>로그인</span>
                </li>
                <li className="link-item">
                  <span onClick={() => navi("/agreement")}> 회원가입</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Header;
