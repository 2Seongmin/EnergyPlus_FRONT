import { HeaderRow, ReplyDiv, SearchButton, ReplyTextarea } from "../../../TableStyle/Table.style";
import { useState } from "react";
import axios from "axios";
import URL_CONFIG from "../../../../../conf";

const ReplyForm = ({ qnaId, onComplete }) => {

  const [replyContent, setReplyContent] = useState("");
  const apiUrl = URL_CONFIG.API_URL;

  // 댓글 등록
  const handleSubmit = () => {

    if(!replyContent.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    axios.post(`${apiUrl}/replys`,{
      qnaId,
      qnaReply: replyContent,
    })
      .then(() => {
        try {
          alert("댓글이 등록되었습니다.");
          setReplyContent("");
          if (onComplete) onComplete();
        } catch (err) {
          console.error("등록 후 처리 중 오류", err);
        }
      })
      .catch((error) => {
        console.log("댓글 등록 실패", error);
        alert("댓글 등록 중 오류 발생");
      });
  };

  return(
    <>
      <br/>
      <ReplyDiv>
        <HeaderRow>
            <ReplyTextarea 
              placeholder="댓글을 입력해주세요"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}/>

            <SearchButton onClick={handleSubmit}>등록</SearchButton>
        </HeaderRow>
      </ReplyDiv>
    </>
  );
};

export default ReplyForm;