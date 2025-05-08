import { HeaderRow, ReplyDiv, ReplyTitle, ReplyDate, 
  ReplyDetail, DeleteReply, SearchButton, Replybutton } from "../../../TableStyle/Table.style";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminReplyFormEdit from "./AdminReplyFormEdit";
import AdminSidebar from "../../AdminSidebar";


const AdminReply = ({ qnaId }) => {

  const navi = useNavigate();
  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 수정 여부
  const [isEditing, setIsEditing] = useState(false);

  // 댓글 불러오기
  const fetchReply = () => {
    axios.get(`http://localhost/replys?qnaId=${qnaId}`)
      .then((response) => {
        if (response.status === 200 && response.data.length > 0) {
          //console.log("댓글 응답 결과:", response.data);
          setReply(response.data[0]);
        } else {
          setReply(null);
        }
      })
      .catch((error) => {
        console.log("댓글 조회 중 오류 발생", error);
        setReply(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReply();
  }, [qnaId]);


  // 댓글 삭제
  const handleDelete = (e) => {
    e.preventDefault();

    if(confirm("정말 삭제하시겠습니까?")){
      axios.delete(`http://localhost/replys/${reply.qnaReplyId}`)
      .then(() => {
        setReply({
          replyId : "삭제 중입니다...",
        });

        setTimeout(() => {
          alert("삭제되었습니다.");
          navi("/admin/mypage_qna");
        }, 500);
      })
      .catch((err) => {
        console.error("댓글 삭제 실패:", err.response || err.message);
        alert("삭제에 실패했습니다.");
      });
    }
  };

  // 댓글 수정 버튼 클릭
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 등록 또는 수정 완료 후 콜백
  const handleComplete = () => {
    fetchReply(); // 댓글 다시 불러오기
    setIsEditing(false);
  };

  if (loading) {
    return <p>댓글을 불러오는 중입니다...</p>;
  }

  
  return (
    <>
      <AdminSidebar />
      {reply ? (
        isEditing ? (
          <AdminReplyFormEdit
            qnaId={qnaId}
            replyId={reply.qnaReplyId}
            originReply={reply.qnaReply}
            onComplete={handleComplete}
          />
        ) : (
          <>
            <br />
            <Replybutton>
              <SearchButton onClick={handleEditClick}>댓글 수정</SearchButton>
              <DeleteReply onClick={handleDelete}>댓글 삭제</DeleteReply>
            </Replybutton>
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
          <AdminReplyFormEdit qnaId={qnaId} onComplete={handleComplete} />
        </>
      )}
    </>
  );
};

export default AdminReply;