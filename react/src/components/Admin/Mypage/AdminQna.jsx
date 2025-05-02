import { useSearchParams, useNavigate } from "react-router-dom";
import { Wrapper, HeaderRow, PageBtn, Pagination, SearchBox, SearchButton,
  SearchInput, StyledTable, Title, WriteButton, BackBtn, DeleteButton } from "../../TableStyle/Table.style";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminQna = () => {

  const navi = useNavigate();
    
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page")) || 0;
    const keywordParam = searchParams.get("keyword") || "";
    
    // 검색
    const [keyword, setKeyword] = useState(keywordParam);
    const [searchKeyword, setSearchKeyword] = useState(keywordParam); // 검색 확정된 값
  
    const [boards, setBoards] = useState([]);
    const [page, setPage] = useState(pageParam);
    const [totalCount, setTotalCount] = useState(0);
    const size = 5;
    const totalPages = Math.ceil(totalCount/size); // 계산된 총 페이지 수
  
    const pageBlockSize = 5; // 한 화면에 보여줄 숫자 버튼 수
    const currentBlock = Math.floor(page / pageBlockSize); // 현재 블록 번호
    const startPage = currentBlock * pageBlockSize;
    const endPage = Math.min(startPage + pageBlockSize, totalPages);
  
    useEffect(() => {
      axios.get("http://localhost/admin/qnas", {
        params: {
          page : page,
          keyword : searchKeyword, // 검색어
        },
      })
        .then((response) => {
          setBoards(response.data.list);
          setTotalCount(response.data.totalCount); // 페이지네이션 유지
        })
        .catch((error) => {
          console.log(error);
        });
    }, [page, searchKeyword]);
  
    // 검색 버튼 클릭 > URL에 반영
    const handleSearch = () => {
      setPage(0); // 검색했을 때 1페이지부터
      setSearchKeyword(keyword);
      setSearchParams({ page: 0, keyword }); // URL 변경
    };
  
    // 페이지 유지
    const goToPage = (p) => {
      setPage(p);
      setSearchParams({ page: p, keyword: searchKeyword });
    };
  
    // 검색어 초기화
    const resetSearch = () => {
      setKeyword("");
      setSearchKeyword("");
      setPage(0);
      setSearchParams({ page: 0 }); // keyword 제거
    };

  return(
    <>
      <Wrapper>
        <HeaderRow>
          <Title>QnA</Title>

          {/* 검색창 */}
          <SearchBox>
            <SearchInput 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"/>

            <SearchButton onClick={handleSearch}>검색</SearchButton>

            {keyword.length > 0 && (
              <SearchButton onClick={resetSearch}>초기화</SearchButton>
            )}
          </SearchBox>
        </HeaderRow>

        <StyledTable>
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>작성시간</th>
              <th>답변 현황</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

          {/* 답변 현황 */}
            {boards.map((qna)=>(
              <tr key={qna.qnaId}
                  onClick={() => navi(`/mypage_qna/${qna.qnaId}`)} 
                  style={{ cursor: "pointer"}}>
                <td>{qna.qnaId}</td>
                <td>{qna.qnaTitle}</td>
                <td>{qna.qnaDate}</td>
                <td className=
                  {qna.qnaStatus === "N" ? "status-checking" : "status-complete"}>
                  {qna.qnaStatus === "N" ? "확인중" : "답변완료"}
                </td>
                <td><DeleteButton>삭제</DeleteButton></td>
              </tr>
            ))}

          </tbody>
        </StyledTable>

        {/* 페이징 처리 */}
        <Pagination>
          <PageBtn onClick={() => setPage(0)} disabled={page === 0}>≪</PageBtn>
          <PageBtn onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>{"<"}</PageBtn>

          {Array.from({ length: endPage - startPage }, (_, i) => (
            <PageBtn
              key={startPage + i}
              onClick={() => goToPage(startPage + i)}
              active={page === startPage + i}
            >
              {startPage + i + 1}
            </PageBtn>
          ))}

          <PageBtn onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={page === totalPages - 1}>{">"}</PageBtn>
          <PageBtn onClick={() => setPage(totalPages - 1)} disabled={page === totalPages - 1}>≫</PageBtn>
        </Pagination>

        <BackBtn onClick={() => navi("/mypage_main")}>뒤로가기</BackBtn>
      </Wrapper>
    </>
  );
};

export default AdminQna;