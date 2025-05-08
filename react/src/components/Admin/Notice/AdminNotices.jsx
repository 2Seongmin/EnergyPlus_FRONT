import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost/admin/notices")
      .then((res) => {
        console.log("📢 공지사항 응답:", res.data);
        if (Array.isArray(res.data)) {
          setNotices(res.data);
        } else {
          console.warn("응답이 배열이 아님", res.data);
          setNotices([]);
        }
      })
      .catch((err) => {
        console.error("❌ 공지사항 불러오기 실패:", err);
        setNotices([]);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    axios
      .delete(`http://localhost/admin/notices/${id}`)
      .then(() => {
        alert("삭제 완료");
        setNotices((prev) => prev.filter((n) => n.noticeId !== id));
      })
      .catch((err) => {
        console.error("❌ 삭제 실패", err);
        alert("삭제 중 오류 발생");
      });
  };

  const goToWrite = () => navigate("/admin/noticewrite");
  const goToEdit = (id) => navigate(`/admin/notices/${id}/edit`);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>📢 관리자 공지사항 목록</h2>
        <button onClick={goToWrite}>공지 작성</button>
        <ul>
          {notices.map((notice) => (
            <li key={notice.noticeId}>
              <strong>{notice.noticeTitle}</strong>
              <button onClick={() => goToEdit(notice.noticeId)}>수정</button>
              <button onClick={() => handleDelete(notice.noticeId)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminNotices;
