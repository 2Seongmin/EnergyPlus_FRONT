import { FaUserEdit, FaUserLock, FaUserTimes, FaClipboard, FaCoins, FaQuestionCircle } from "react-icons/fa";
import { Container, ContentWrapper, TopSection, Profile, Greeting, Welcome, Grade, 
          MenuGrid, MenuItem, Label } from "./Mypage.style";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect  } from "react";

const MypageMain = () => {

  const navi = useNavigate();
  const userName = sessionStorage.getItem("userName"); // 유저명
  const token = sessionStorage.getItem("accessToken");
  const [grade, setGrade] = useState({ icon: "", name: "" });

  // 등급 지정
  const getGradeName = (gradeId) => {
    switch (gradeId) {
      case 1:
        return { icon: "🌱", name: "새싹" };
      case 2:
        return { icon: "🌳", name: "나무" };
      case 3:
        return { icon: "🌲", name: "숲" };
      default:
        return { icon: "🌍", name: "지구" };
    }
  };

  // 내 등급 조회
  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const response = await axios.get("http://localhost/info/grade", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const gradeId = response.data.gradeId;
        setGrade(getGradeName(gradeId));
      } catch (error) {
        console.error("내 등급 불러오기 실패", error);
      }
    };

    fetchUserData();
  }, []);

  return(
    <>
      <Container>
        <ContentWrapper>
          <TopSection>
            <Profile>
              <Greeting>
                <Welcome><strong>{userName}</strong>님 환영합니다.</Welcome>
                <Grade>현재 내 등급 : <strong style={{color: "#408C70"}}>{grade.icon}{grade.name}</strong></Grade>
              </Greeting>
            </Profile>
          </TopSection>

          <MenuGrid>
            <MenuItem onClick={() => navi("/mypage_info")}>
              <FaUserEdit size={50} />
              <Label>내 정보 수정</Label>
            </MenuItem>
            <MenuItem onClick={() => navi("/mypage_password")}>
              <FaUserLock size={50} />
              <Label>비밀번호 변경</Label>
            </MenuItem>
            <MenuItem onClick={() => navi("/mypage_delMember")}>
              <FaUserTimes size={50} />
              <Label>회원 탈퇴</Label>
            </MenuItem>
            <MenuItem onClick={() => navi("/mypage_market")}>
              <FaClipboard size={50} />
              <Label>나의 게시글</Label>
            </MenuItem>
            <MenuItem onClick={() => navi("/mypage_mile_visual")}>
              <FaCoins size={50} />
              <Label>마일리지 현황</Label>
            </MenuItem>
            
            <MenuItem
              onClick={() => {
                const role = sessionStorage.getItem("userRole");
                if (role === "ROLE_ADMIN") {
                  navi("/admin/mypage/qna"); // 관리자용
                } else {
                  navi("/mypage_qna"); // 일반 사용자용
                }
              }}
            >
              <FaQuestionCircle size={50} />
              <Label>QnA</Label>
            </MenuItem>

          </MenuGrid>
        </ContentWrapper>
      </Container>
    </>
  );
};

export default MypageMain;