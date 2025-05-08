import React, { useEffect, useState } from "react";
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


const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [page, setPage]                   = useState(0);
  const [totalCount, setTotalCount]       = useState(0);
  const [keyword, setKeyword] = useState("");
  const size = 10;
  const totalPages                         = Math.ceil(totalCount / size);
  const navigate = useNavigate();
  
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    axios.get("http://localhost/challenges",{
      params : {page, size, keyword: searchKeyword }
    },
    )
    .then(res => {
      setChallenges(res.data);
    })
    axios.get("http://localhost/challenges/pages", {
      params: { keyword: searchKeyword }
    })
    .then(res => {
      setTotalCount(res.data * size);
    });
  }, [page, searchKeyword]);

  // 검색 핸들러
  const handleSearch = () => {
    setPage(0);
    setSearchKeyword(keyword);
  };
  const resetSearch = () => {
    setKeyword("");
    setSearchKeyword("");
    setPage(0);
  };

   // 3) 페이징 블록 계산
   const blockSize  = 5;
   const blockIndex = Math.floor(page / blockSize);
   const startPage  = blockIndex * blockSize;
   const endPage    = Math.min(startPage + blockSize, totalPages);

  return (
    <Wrapper>
      <HeaderRow>
          <Title>챌린지 참여 게시판</Title>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="검색"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              />
            <SearchButton onClick={handleSearch}>검색</SearchButton>
            <WriteButton onClick={() => navigate('/challenges/write')}>글 작성</WriteButton>
          </SearchBox>
      </HeaderRow>

        <StyledTable>
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map(c => (
              <tr key={c.challengeSeq} onClick={() => navigate(`/challenges/${c.challengeSeq}`)}>
                <td>{c.challengeSeq}</td>
                <td>{c.challengeTitle}</td>
                <td>{c.userName}</td>
                <td>{c.enrollDate}</td>
                <td>{c.challengeStatus === 'Y' ? '답변완료' : '확인중'}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>

      

      <Pagination>
        <PageBtn onClick={() => setPage(0)} disabled={page === 0}>
          ≪
        </PageBtn>
        <PageBtn
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
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

        <BackBtn onClick={() => navigate(-1)}>뒤로가기</BackBtn>
      </Wrapper>
  );
};

export default ChallengeList;
