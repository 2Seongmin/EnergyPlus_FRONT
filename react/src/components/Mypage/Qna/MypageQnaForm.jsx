import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Wrapper, HeaderRow, Title, ContentDiv, BackBtn, UpdateInput, UpdateBtn, UpdateTextarea,
  ContentDetail, FooterRow } from "../../TableStyle/Table.style";
import URL_CONFIG from "../../../../conf.js";

const MypageQnaForm = () => {

  const { id } = useParams(); // 수정할 글 ID
  const navi = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = sessionStorage.getItem("accessToken");
  const apiUrl = URL_CONFIG.API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/qnas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setTitle(response.data.qnaTitle);
      setContent(response.data.qnaContent);
    })
    .catch((err) => console.error("글 불러오기 실패", err));
  }, [id, token]);

  const handleUpdate = () => {
    const data = { qnaTitle: title, qnaContent: content };

    axios.put(`${apiUrl}/qnas/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      alert("게시글이 수정되었습니다.");
      navi(`/mypage_qna/${id}`, { replace: true });
    })
    .catch((err) => {
      console.error("글 수정 실패", err);
      alert("글 수정에 실패했습니다.");
    });
  };

  const handleBack = () => {
    navi(`/mypage_qna/${id}`, { replace: true });
  };

  return (
    <>
      <Wrapper>
        <HeaderRow>
          <Title>글 수정</Title>
        </HeaderRow>
        <ContentDiv>
          <HeaderRow>
            <div style={{ width: "100%" }}>
              <UpdateInput value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 작성해주세요." />
            </div>
          </HeaderRow>
          <hr />
          <ContentDetail>
            <UpdateTextarea value={content} onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 작성해주세요." />
          </ContentDetail>
        </ContentDiv>

        <div style={{ textAlign: "center" }}>
          <FooterRow>
            <UpdateBtn onClick={handleUpdate}>수정하기</UpdateBtn>
            <BackBtn onClick={handleBack}>뒤로가기</BackBtn>
          </FooterRow>
        </div>
      </Wrapper>
    </>
  );
};

export default MypageQnaForm;
