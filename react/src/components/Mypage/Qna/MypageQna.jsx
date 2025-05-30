import { useSearchParams, useNavigate } from "react-router-dom";
import { Wrapper, HeaderRow, StyledTable, Title, BackBtn } from "../../TableStyle/Table.style";
import { useEffect, useState } from "react";
import axios from "axios";
import URL_CONFIG from "../../../../conf.js";
import CustomPagination from "../../Common/Pagination.jsx";
import SearchBar from "../../Common/SearchBar.jsx";

const MypageQna = () => {

  const navi = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 0;
  const keywordParam = searchParams.get("keyword") || "";
  
  const [searchKeyword, setSearchKeyword] = useState(keywordParam); // 검색 확정된 값
  const [boards, setBoards] = useState([]); // 결과 목록
  const [page, setPage] = useState(pageParam); // 현재 페이지
  const [totalCount, setTotalCount] = useState(0); // 전체 항목 수
  const size = 5; // 페이지당 게시글 수
  const totalPages = Math.ceil(totalCount/size); // 계산된 총 페이지 수

  const token = sessionStorage.getItem("accessToken");
  const apiUrl = URL_CONFIG.API_URL;
  

  useEffect(() => {
    axios.get(`${apiUrl}/qnas`, {
      params: {
        page : page,
        keyword : searchKeyword, // 검색어
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setBoards(response.data.list);
        setTotalCount(response.data.totalCount); // 페이지네이션 유지
      })
      .catch((error) => {
        console.log(error);
        alert("데이터를 불러오는 데 실패했습니다.");
      });
  }, [page, searchKeyword]);


  return(
    <>
      <Wrapper>
        <HeaderRow>
          <Title>QnA</Title>
          {/* 검색창 */}
          <SearchBar
            initialKeyword={keywordParam}
            onSearchConfirm={(confirmedKeyword) => {
              setSearchKeyword(confirmedKeyword);
              setPage(0);
              setSearchParams(confirmedKeyword ? { page: 0, keyword: confirmedKeyword } : { page: 0 });
            }}
          />
        </HeaderRow>

        <StyledTable>
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>작성시간</th>
              <th>답변 현황</th>
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
              </tr>
            ))}

          </tbody>
        </StyledTable>

        {/* 검색 결과 없으면 표시 */}
        {boards.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#888" }}>
            검색 결과가 없습니다.
          </p>
        )}

        {/* 페이징 처리 */}
        <CustomPagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p);
            setSearchParams({ page: p, keyword: searchKeyword });
          }}
        />

        <BackBtn onClick={() => navi("/mypage_main")}>뒤로가기</BackBtn>
      </Wrapper>
    </>
  );
};

export default MypageQna;

