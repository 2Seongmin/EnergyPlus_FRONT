import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Wrapper, HeaderRow, Title, ContentDiv, BackBtn, UpdateInput, UpdateBtn, UpdateTextarea,
  ContentDetail, FooterRow } from "../../TableStyle/Table.style";
import URL_CONFIG from "../../../../conf.js";

const MypageQnaWrite = () => {

  const navi = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = sessionStorage.getItem("accessToken");
  const apiUrl = URL_CONFIG.API_URL;

  const handleSubmit = () => {
    const data = { qnaTitle: title, qnaContent: content };

    axios.post(`${apiUrl}/qnas`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      alert("게시글이 작성되었습니다.");
      navi("/mypage_qna");
    })
    .catch((err) => {
      console.error("글 작성 실패", err);
      alert("글 작성에 실패했습니다.");
    });
  };

  const handleBack = () => {
    navi("/mypage_qna");
  };

  return (
    <>
      <Wrapper>
        <HeaderRow>
          <Title>글 작성</Title>
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
            <UpdateBtn onClick={handleSubmit}>작성하기</UpdateBtn>
            <BackBtn onClick={handleBack}>뒤로가기</BackBtn>
          </FooterRow>
        </div>
      </Wrapper>
    </>
  );
};

export default MypageQnaWrite;
