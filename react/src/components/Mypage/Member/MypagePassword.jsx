import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Label, Input,  UpdateBtn, BackBtn } from "./Member.style";
import { useState } from "react";
import axios from "axios";

const MypagePassword = () => {

  const navi = useNavigate();
  const token = sessionStorage.getItem("accessToken");

  const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인

  const handleChangePassword = async () => {
    if(!currentPassword || !newPassword || !confirmPassword){
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if(newPassword !== confirmPassword){
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.put("http://localhost/info/pass", {
        currentPassword: currentPassword,
        newPassword: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 세션스토리지에서 토큰 제거 (로그아웃 처리)
      sessionStorage.clear();

      alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
      
      // 강제 리다이렉트 + 새로고침
      window.location.replace("/login");
    }
    catch(error) {
      console.log("비밀번호 변경 오류", error);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  return(
    <>
      <Title>비밀번호 변경</Title>
      <InfoContainer>
        <LeftDiv>

          <Label>현재 비밀번호</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <Label>새 비밀번호</Label>
          <Input 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Label>새 비밀번호 확인</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <BtnDiv>
            <UpdateBtn onClick={handleChangePassword}>변경하기</UpdateBtn>
            <BackBtn onClick={() => navi(-1)}>뒤로가기</BackBtn>
          </BtnDiv>
        </LeftDiv>
      </InfoContainer>
    </>
  );
};

export default MypagePassword;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-top: 100px;
  margin-left: 30%;
  margin-bottom: 40px;
  text-align: start;
`;

const InfoContainer = styled.div`
  width: 100%;
  height: calc(100vh - 590px);
  display: flex;
  justify-content: center;
  align-items: start;
`;

const LeftDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  gap: 20px;
  align-items: start;
`;

// 버튼 묶음
export const BtnDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-left: 5px;
  margin-top: 30px;
`;