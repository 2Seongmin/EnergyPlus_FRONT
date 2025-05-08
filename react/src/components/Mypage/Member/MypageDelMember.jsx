import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Label, Input,  UpdateBtn, BackBtn } from "./Member.style";
import axios from "axios";

const MypageDelMember = () => {

  const navi = useNavigate();
  
  const handleWithdraw = async () => {
    const confirmed = window.confirm("정말 탈퇴하시겠습니까?");
    if (!confirmed) return;

    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axios.delete("http://localhost/members/withdrawal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message || "회원 탈퇴가 완료되었습니다.");
      sessionStorage.clear();
      window.location.replace("/");
    } catch (error) {
      console.error("탈퇴 실패", error);
      alert(
        error.response?.data?.error || "회원 탈퇴 중 오류가 발생했습니다."
      );
    }
  };

  return(
    <>
      <Title>회원 탈퇴</Title>
      <InfoContainer>
        <LeftDiv>
          <p style={{ color: 'red', fontWeight: 'bold' }}>
              ⚠ 정말 탈퇴하시겠습니까?<br />
              탈퇴 후에는 계정 복구가 불가능하며, 모든 활동 정보가 비활성화됩니다.
          </p>
          <BtnDiv>
            <UpdateBtn onClick={handleWithdraw}>탈퇴하기</UpdateBtn>
            <BackBtn onClick={() => navi(-1)}>뒤로가기</BackBtn>
          </BtnDiv>
        </LeftDiv>
      </InfoContainer>
    </>
  );
};

export default MypageDelMember;



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
  gap: 30px;
  align-items: start;
`;

// 버튼 묶음
export const BtnDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-left: 5px;
`;