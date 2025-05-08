import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Wrapper,
  HeaderRow,
  Title,
  SearchBox,
  SearchButton,
  DeleteButton,
  ContentDiv,
  ContentTitle,
  ContentDate,
  ContentDetail,
  BackBtn
} from "../TableStyle/Table.style";


const ChallengeDetail = () => {
  const { challengeSeq } = useParams();
  const navi = useNavigate();
  const [challenge, setChallenge] = useState(null);

  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    axios.get(`http://localhost/challenges/${challengeSeq}`)
      .then(res => {
        setChallenge(res.data);
      })
      .catch(err => console.error("챌린지 상세 불러오기 실패", err));
  }, [challengeSeq]);

  const handleEdit = () => navi(`/challenges/edit/${challengeSeq}`);
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost/challenges/${challengeSeq}`);
      alert("삭제가 완료되었습니다.");
      navi("/challenges");

    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제 중 오류가 발생했습니다.");
      navi("/challenges");
    }
  };

  if (!challenge) return <Wrapper>로딩 중...</Wrapper>;

  return (
    <>
      <Wrapper>
        <HeaderRow>
          <Title>챌린지 상세 확인</Title>
          <SearchBox>
              <>
                <SearchButton onClick={handleEdit}>글 수정</SearchButton>
                <DeleteButton onClick={handleDelete}>글 삭제</DeleteButton>
              </>
          </SearchBox>
        </HeaderRow>

        <ContentDiv>
          <HeaderRow>
            <ContentTitle>{challenge.challengeTitle}</ContentTitle>
            <ContentDate>No: {challenge.challengeSeq}</ContentDate>
            <strong>{challenge.userName}</strong>
            <strong>{challenge.enrollDate}</strong>
          </HeaderRow>
          <hr />
          <ContentDetail>
            {challenge.challengeImg && (
            <div style={{ marginTop: "2rem" }}>
              <img
                src={`http://localhost:80${challenge.challengeImg}`}
                alt="챌린지 이미지"
                style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}/>
              </div>
              
            )}
            {challenge.challengeContent}
            <br /><br />
            <strong>상태:</strong> {challenge.challengeStatus === "Y" ? "완료" : "진행중"}
          
          </ContentDetail>
        </ContentDiv>

        <BackBtn onClick={() => navi(-1)}>뒤로가기</BackBtn>
      </Wrapper>
    </>
  );
};

export default ChallengeDetail;
