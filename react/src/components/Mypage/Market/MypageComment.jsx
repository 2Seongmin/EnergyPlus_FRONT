import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";

const MypageComment = ({ marketNo }) => {
  const token = sessionStorage.getItem("accessToken");
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);

    useEffect(() => {
    fetchComments();
  }, [marketNo]);

  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  const fetchComments = () => {
    axios
      .get(`http://localhost/markets/comments/${marketNo}`, config)
      .then((res) => {
        const comments = res.data;
        setComments(comments);
        fetchRepliesForAllComments(comments);
      })
      .catch((err) => console.error("댓글 조회 실패", err));
  };

  const fetchRepliesForAllComments = (comments) => {
    Promise.all(
      comments.map((c) =>
        axios.get(`http://localhost/markets/reply/${c.marketCommentNo}`, config)
      )
    )
      .then((responses) => {
        const allReplies = responses.flatMap((res) => res.data);
        setReplies(allReplies);
      })
      .catch((err) => console.error("답글 조회 실패", err));
  };

  return (
    <div className="comment-section">
      <h3>댓글</h3>

      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.marketCommentNo} className="comment-item">
            <div className="comment-meta">
              <div className="comment-meta-left">
                <span className="comment-writer">{comment.userName}</span>
                <em className="line">|</em>
                <span className="comment-date">
                  {new Date(comment.marketCommentDate).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>

            <div className="comment-content-wrap">
              <p className="comment-content">{comment.marketCommentContent}</p>

              {/* 답글 리스트 */}
              <ul className="reply-list">
                {replies
                  .filter((r) => r.marketCommentNo === comment.marketCommentNo)
                  .map((reply) => (
                    <li key={reply.replyNo} className="reply-item">
                      <div className="reply-item-left">
                        <MdOutlineSubdirectoryArrowRight />
                      </div>
                      <div className="reply-item-right">
                        <div className="reply-meta">
                          <div className="reply-meta-left">
                            <span className="reply-writer">{reply.userName}</span>
                            <em className="line">|</em>
                            <span className="reply-date">
                              {new Date(reply.replyDate).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                        </div>
                        <div className="reply-content-wrap">
                          <p className="reply-content">{reply.replyContent}</p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MypageComment;
