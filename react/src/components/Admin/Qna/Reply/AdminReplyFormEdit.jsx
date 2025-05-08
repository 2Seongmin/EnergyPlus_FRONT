import { HeaderRow, ReplyDiv, SearchButton, ReplyTextarea } from "../../../TableStyle/Table.style";
import { useEffect, useState } from "react";
import axios from "axios";


const AdminReplyFormEdit = ({ replyId, qnaId, originReply, onComplete }) => {

  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    setReplyContent(originReply);
  }, [originReply]);

  const handleSubmit = () => {
    if(!replyContent.trim()){
      alert("댓글을 입력해주세요.");
      return;
    }

    axios.put(`http://localhost/replys/${replyId}`, {
      qnaId,
      qnaReply: replyContent,
    })
      .then(() => {
        alert("댓글이 수정되었습니다.");
        setReplyContent("");
        onComplete(); // 수정 후 콜백
      })
      .catch((error) => {
        console.error("댓글 수정 실패:", error);
        alert("댓글 수정 중 오류 발생");
      });
  };

  return(
    <ReplyDiv>
      <HeaderRow>
        <ReplyTextarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
        <SearchButton onClick={handleSubmit}>수정</SearchButton>
      </HeaderRow>
    </ReplyDiv>
  );
};

export default AdminReplyFormEdit;