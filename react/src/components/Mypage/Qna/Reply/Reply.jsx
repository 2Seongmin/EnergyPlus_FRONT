import { HeaderRow, ReplyDiv, ReplyTitle, ReplyDate, ReplyDetail } from "../../../TableStyle/Table.style";
import { useEffect, useState } from "react";
import axios from "axios";
import ReplyForm from "./ReplyForm";
import ReplyFormEdit from "./ReplyFormEdit";
import URL_CONFIG from "../../../../../conf";


const Reply = ({ qnaId }) => {

  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const apiUrl = URL_CONFIG.API_URL;

  // 댓글 불러오기
  useEffect(() => {
    axios
      .get(`${apiUrl}/replys?qnaId=${qnaId}`)
      .then((res) => {
        const [firstReply] = res.data;
        setReply(firstReply || null);
      })
      .catch((err) => {
        console.error("댓글 조회 중 오류 발생", err);
        setReply(null);
      })
      .finally(() => setLoading(false));
  }, [qnaId]);

  if (loading) {
    return <p>댓글을 불러오는 중입니다...</p>;
  }

  
  return (
    <>
      {reply ? (
        isEditing ? (
          <ReplyFormEdit
            qnaId={qnaId}
            replyId={reply.qnaReplyId}
            originReply={reply.qnaReply}
            onComplete={handleComplete}
          />
        ) : (
          <>
            <br />
            <ReplyDiv>
              <HeaderRow>
                <ReplyTitle>관리자</ReplyTitle>
                <ReplyDate>{reply.qnaReplyDate}</ReplyDate>
              </HeaderRow>
              <ReplyDetail>{reply.qnaReply}</ReplyDetail>
            </ReplyDiv>
          </>
        )
      ) : (
        <>
          <ReplyForm qnaId={qnaId} onComplete={handleComplete} />
        </>
      )}
    </>
  );
};

export default Reply;