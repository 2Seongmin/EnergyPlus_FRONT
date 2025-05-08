import { useParams, useNavigate } from "react-router-dom";
import { Wrapper, HeaderRow, Title, SearchBox, SearchButton, 
      DeleteButton, ContentDiv, BackBtn, 
      ContentTitle, ContentDate, ContentDetail } from "../../TableStyle/Table.style";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminReply from "./Reply/AdminReply";
import AdminReplyForm from "./Reply/AdminReplyForm";

const AdminQnaDetail = () => {

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
          <Title>QnA 게시글 번호 : {id}</Title>
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

        {qnaStatus === "Y" ? (
          <AdminReply qnaId={id} /> // 댓글 존재
        ) : qnaStatus === "N" ? (
          <AdminReplyForm qnaId={id} /> // 댓글 없음 → 작성 폼
        ) : (
          <p>댓글 상태를 불러오는 중입니다...</p> // 초기 로딩 처리
        )}

        <BackBtn onClick={() => navi(-1)}>뒤로가기</BackBtn>
      </Wrapper>
    </>
  );
};

export default AdminQnaDetail;