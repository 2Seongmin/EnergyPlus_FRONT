import { useSearchParams, useNavigate } from "react-router-dom";
import { Wrapper, HeaderRow, SearchBox, SearchButton, StyledTable, Title, BackBtn } from "../../TableStyle/Table.style";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import CustomPagination from "../../Common/Pagination";
import URL_CONFIG from "../../../../conf";

const EmptyRow = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} style={{ textAlign: "center", padding: "1rem" }}>
      검색 결과가 없습니다.
    </td>
  </tr>
);

const MypageMile = () => {
  const navi = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 0;
  const keywordParam = searchParams.get("keyword") || "";

  const [selectedCategory, setSelectedCategory] = useState(keywordParam);
  const [mileData, setMileData] = useState([]);
  const [page, setPage] = useState(pageParam);
  const [totalCount, setTotalCount] = useState(0);
  const size = 5;
  const totalPages = Math.ceil(totalCount / size);

  const token = sessionStorage.getItem("accessToken");
  const [selectedRejectedId, setSelectedRejectedId] = useState(null);
  const apiUrl = URL_CONFIG.API_URL;

  useEffect(() => {
    const params = { page: page };
    if (selectedCategory) params.keyword = selectedCategory;

    axios.get(`${apiUrl}/mymile`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setMileData(res.data.list ?? []);
        setTotalCount(res.data.totalCount ?? 0);
      })
      .catch((err) => {
        console.error("마일리지 조회 실패", err);
      });
  }, [page, selectedCategory]);

  
  const handleCancel = (id) => {
    if (!window.confirm(`${id}번 신청을 취소하시겠습니까?`)) return;

    axios
      .delete(`${apiUrl}/mymile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("신청이 취소되었습니다.");
        setSelectedCategory((prev) => prev);
      })
      .catch((err) => {
        console.error("신청 취소 실패:", err);
        alert("취소 요청 중 문제가 발생했습니다.");
      });
  };

  // 반려사유 확인
  const renderStatusCell = (item) => {
    if (item.mileageStatus === "S") return <span style={{ color: "gray" }}>지급완료</span>;
    if (item.mileageStatus === "N")
      return <SearchButton onClick={() => handleCancel(item.mileageSeq)}>취소하기</SearchButton>;
    if (item.mileageStatus === "R")
      return (
        <span
          title="클릭하여 반려 사유를 확인해주세요"
          style={{ color: "#d32f2f", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => setSelectedRejectedId(
            selectedRejectedId === item.mileageSeq ? null : item.mileageSeq
          )}
        >
          신청반려▼
        </span>
      );
  };

  return (
    <Wrapper>
      <HeaderRow>
        <Title>마일리지 신청 현황</Title>
        <SearchBox>
          <select
            value={selectedCategory}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategory(value);
              setPage(0);
              setSearchParams(value ? { page: 0, keyword: value } : { page: 0 });
            }}
            style={{ padding: "0.5rem", borderRadius: "4px" }}
          >
            <option value="">카테고리 선택</option>
            <option value="자전거">자전거</option>
            <option value="다회용기">다회용기</option>
            <option value="기타">기타</option>
          </select>

          {selectedCategory && (
            <SearchButton onClick={() => {
              setSelectedCategory("");
              setPage(0);
              setSearchParams({ page: 0 });
            }}>
              초기화
            </SearchButton>
          )}
        </SearchBox>
      </HeaderRow>

      <StyledTable>
        <thead>
          <tr>
            <th>No</th>
            <th>카테고리</th>
            <th>마일리지 금액</th>
            <th>작성시간</th>
            <th>승인 시간</th>
            <th>신청 현황</th>
          </tr>
        </thead>
        <tbody>
          {mileData.length === 0 ? (
            <EmptyRow colSpan={6} />
          ) : (
            mileData.map((item) => (
              <React.Fragment key={item.mileageSeq}>
                <tr>
                  <td>{item.mileageSeq}</td>
                  <td>{item.mileageCategory}</td>
                  <td>{item.mileageScore}</td>
                  <td>{item.createDate}</td>
                  <td>{item.approveDate}</td>
                  <td>{renderStatusCell(item)}</td>
                </tr>

                {selectedRejectedId === item.mileageSeq && (
                  <tr>
                    <td colSpan={6}>
                      <div
                        style={{
                          border: "1px solid #d32f2f",
                          padding: "1rem",
                          borderRadius: "6px",
                          background: "#ffecec",
                          color: "#d32f2f",
                          textAlign: "left",
                        }}
                      >
                        <strong>반려 사유 :</strong> {item.mileageReject}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </StyledTable>

      <div style={{ marginTop: "10px", color: "red" }}>
        * 관리자가 승인하기 전까지 마일리지 신청을 취소하실 수 있습니다.
      </div>

      {/* 페이징 처리 */}
      <CustomPagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p);
          setSearchParams({ page: p, keyword: selectedCategory });
        }}
      />

      <BackBtn onClick={() => navi("/mypage_mile_visual")}>뒤로가기</BackBtn>
    </Wrapper>
  );
};

export default MypageMile;