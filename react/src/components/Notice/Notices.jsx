import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Wrapper,
  HeaderRow,
  Title,
  SearchBox,
  SearchInput,
  SearchButton,
  StyledTable,
  WriteButton,
  Pagination,
  PageBtn,
  BackBtn
} from "../TableStyle/Table.style";

const Notices = () => {
  const navi = useNavigate();

  // 상태 관리
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const size = 10;
  const totalPages = Math.ceil(totalCount / size);

  const blockSize = 5;
  const blockIndex = Math.floor(page / blockSize);
  const startPage = blockIndex * blockSize;
  const endPage = Math.min(startPage + blockSize, totalPages);

  // 데이터 불러오기
  useEffect(() => {
    axios
      .get("http://localhost/notices", {
        params: { page, keyword: searchKeyword }
      })
      .then(res => setNotices(res.data));

    axios
      .get("http://localhost/notices/pages", {
        params: { keyword: searchKeyword }
      })
      .then(res => setTotalCount(res.data * size));
  }, [page, searchKeyword]);

  // 검색
  const handleSearch = () => {
    setPage(0);
    setSearchKeyword(keyword);
  };

  const resetSearch = () => {
    setKeyword("");
    setSearchKeyword("");
    setPage(0);
  };

  return (
    <Wrapper>
      {/* 제목 + 검색창 */}
      <HeaderRow>
        <Title>공지사항</Title>
        <SearchBox>
          <SearchInput
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
          {keyword && <SearchButton onClick={resetSearch}>초기화</SearchButton>}
        </SearchBox>
      </HeaderRow>

      {/* 공지사항 테이블 */}
      <StyledTable>
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성시간</th>
          </tr>
        </thead>
        <tbody>
          {notices.map(n => (
            <tr
              key={n.noticeId}
              onClick={() => navi(`/notices/${n.noticeId}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{n.noticeId}</td>
              <td>{n.noticeTitle}</td>
              <td>{n.noticeDate}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>

      {/* 검색 결과 없음 */}
      {notices.length === 0 && (
        <p style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
          검색 결과가 없습니다.
        </p>
      )}

      {/* 페이지네이션 */}
      <Pagination>
        <PageBtn onClick={() => setPage(0)} disabled={page === 0}>
          ≪
        </PageBtn>
        <PageBtn onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>
          {"<"}
        </PageBtn>

        {Array.from({ length: endPage - startPage }, (_, i) => (
          <PageBtn
            key={startPage + i}
            onClick={() => setPage(startPage + i)}
            active={page === startPage + i}
          >
            {startPage + i + 1}
          </PageBtn>
        ))}

        <PageBtn
          onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
        >
          {">"}
        </PageBtn>
        <PageBtn
          onClick={() => setPage(totalPages - 1)}
          disabled={page === totalPages - 1}
        >
          ≫
        </PageBtn>
      </Pagination>

      {/* 뒤로가기 */}
      <BackBtn onClick={() => navi(-1)}>뒤로가기</BackBtn>
    </Wrapper>
  );
};

export default Notices;