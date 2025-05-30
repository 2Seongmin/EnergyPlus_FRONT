import { useNavigate } from "react-router-dom";
import { Title, InfoContainer, LeftDiv, Label, Input, BtnDiv, UpdateBtn, BackBtn } from "./Member.style";
import { useEffect, useState } from "react";
import axios from "axios";
import MypagePromise from "./MypagePromise";
import URL_CONFIG from "../../../../conf";

const MypageInfo = () => {

  const navi = useNavigate();
  const token = sessionStorage.getItem("accessToken");
  const apiUrl = URL_CONFIG.API_URL;

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [promiseVersion, setPromiseVersion] = useState(0);

  // 내 정보 조회
  useEffect(() => {
    axios
      .get(`${apiUrl}/info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const userData = response.data;

        // 값이 없으면 그냥 빈 문자열로 처리
        setUserEmail(userData.userEmail || "");
        setUserName(userData.userName || "");
        setUserPhone(userData.userPhone || "");

        setErrorMsg(""); // 정상 조회했으면 에러 메시지 초기화
      })
      .catch((error) => {
        console.error("내 정보 조회 실패", error);
        setErrorMsg("서버 요청에 실패했습니다.");
      });
  }, []);


  // 내 정보 수정
  const handleInfoUpdate = (e) => {
    e.preventDefault();

    if (userPhone.trim().length !== 11 || isNaN(userPhone)) {
      alert("전화번호는 11자리 숫자만 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    axios
      .put(
        `${apiUrl}/info`,
        { userPhone: userPhone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        sessionStorage.setItem("userPhone", userPhone);
        alert("정보가 수정되었습니다.");
        navi("/mypage_info");
      })
      .catch((error) => {
        console.error("정보 수정 실패", error);
        setErrorMsg("정보 수정에 실패했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePromiseChanged = () => {
    console.log("다짐이 등록되었거나 수정되었습니다.");
  };

  return(
    <>
      <Title>내 정보 수정</Title>
      <InfoContainer>

        <LeftDiv>
          <Label>아이디</Label><br/>
          <Input 
              value={userEmail || ""}
              disabled
          /><br/>

          <Label>
            이름 &nbsp;
            <span style={{fontSize:"14px", color:"crimson"}}>
              *변경 사유가 있으면 관리자에게 문의해주세요.
            </span>
          </Label><br/>
          <Input 
              value={userName || ""}
              disabled
          /><br/>

          <Label>전화번호</Label><br/>
          <Input 
            value={userPhone || ""}
            onChange={(e) => setUserPhone(e.target.value)}
          /><br/>

          <BtnDiv>
            <UpdateBtn onClick={handleInfoUpdate} disabled={isLoading}>내 정보 수정하기</UpdateBtn>
            <BackBtn onClick={() => navi(-1)}>뒤로가기</BackBtn>
          </BtnDiv>

        </LeftDiv>

        {/* 나의 다짐 */}
        <MypagePromise token={token} onChanged={handlePromiseChanged} />

      </InfoContainer>
    </>
  );

};

export default MypageInfo;


