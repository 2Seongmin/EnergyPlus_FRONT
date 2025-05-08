import { useParams, useNavigate } from "react-router-dom";
import { Wrapper, HeaderRow, Title, SearchBox, SearchButton, 
      DeleteButton, ContentDiv, BackBtn, ReplyDetail, ReplyDiv,  
      ContentTitle, ContentDate, ContentDetail } from "../../TableStyle/Table.style";
import { useEffect, useState } from "react";
import axios from "axios";
import Reply from "./Reply/Reply";

const MypageQnaDetail = () => {

  const navi = useNavigate();
  const { id } = useParams();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 댓글 현황(Y/N)
  const [qnaStatus, setQnaStatus] = useState(null);
  
  // 토큰
  const token = sessionStorage.getItem("accessToken");
  
  // 조회
  useEffect(() => {
    axios.get(`http://localhost/qnas/${id}`)
      .then((response) => {
        // console.log(response);
        setBoard(response.data);
        setLoading(false);
        setQnaStatus(response.data.qnaStatus);
      })
      .catch((error) => {
        //console.log(error);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // 삭제
  const handleDelete = (e) => {
    e.preventDefault();
    
    if(confirm("정말 삭제하시겠습니까?")){
      // 로그인 구현 완료되면 아래 부분 수정
      axios.delete(`http://localhost/qnas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setBoard({
          qnaTitle : "삭제중입니다...",
          qnaDate : "삭제중입니다...",
          qnaContent : "삭제중입니다..."
        });

        setTimeout(() => {
          alert("삭제되었습니다.");
          navi("/mypage_qna");
        }, 500);
      })
      .catch((error) => {
        console.error("글 삭제 실패", error);
        alert("글 삭제에 실패했습니다.");
      });
    }
  };

  // 수정
  const handleEdit = () => {
    navi(`/mypage_qna_form/${id}`, { replace: true });
  };


  if (loading) {
    return (
      <HeaderRow>
        <ContentTitle>게시글을 불러오는 중입니다...</ContentTitle>
      </HeaderRow>
    );
  }
  if (error) {
    return (
      <HeaderRow>
        <ContentTitle>게시글을 찾을 수 없습니다.</ContentTitle>
      </HeaderRow>
    );
  }

  return(
    <>
      <Wrapper>
        <HeaderRow>
          <Title>나의 QnA</Title>
          <SearchBox>
            <SearchButton onClick={handleEdit}>글 수정</SearchButton>
            <DeleteButton onClick={handleDelete}>글 삭제</DeleteButton>
          </SearchBox>
        </HeaderRow>
        <ContentDiv>
          <HeaderRow>
            <ContentTitle>{board.qnaTitle}</ContentTitle>
            <ContentDate>{board.qnaDate}</ContentDate>
          </HeaderRow>
          <hr/>
          <ContentDetail>
            {board.qnaContent}
          </ContentDetail>
        </ContentDiv>
        
        {/* 댓글란 */}

        {qnaStatus === "Y" && <Reply qnaId={id} />}
        {qnaStatus === "N" && (
          <ReplyDiv>
            <ReplyDetail>등록된 댓글이 없습니다.</ReplyDetail>
          </ReplyDiv>
        )}

        <BackBtn onClick={() => navi(-1)}>뒤로가기</BackBtn>
      </Wrapper>
    </>
  );
};

export default MypageQnaDetail;