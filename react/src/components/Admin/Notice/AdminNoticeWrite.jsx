import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TitleInput,
  ContentTextarea,
  SubmitButton
} from '../../Notice/NoticeWrite.style';
import AdminSidebar from '../AdminSidebar';

const AdminNoticeWrite = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ noticeTitle: '', noticeContent: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost/admin/notices', form);
      alert("공지사항이 등록되었습니다.");
      navigate('/admin/notices');
    } catch (err) {
      console.error('에러 상태:', err.response?.status);
      console.error('에러 응답 바디:', err.response?.data);
      alert('공지사항 등록에 실패했습니다.');
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <AdminSidebar/>
      <h2>📢 관리자 공지사항 작성</h2>
      <TitleInput
        name="noticeTitle"
        value={form.noticeTitle}
        onChange={handleChange}
        placeholder="제목을 입력하세요"
        required
      />
      <ContentTextarea
        name="noticeContent"
        value={form.noticeContent}
        onChange={handleChange}
        placeholder="내용을 입력하세요"
        required
      />
      <SubmitButton type="submit">등록</SubmitButton>
    </Container>
  );
};

export default AdminNoticeWrite;
