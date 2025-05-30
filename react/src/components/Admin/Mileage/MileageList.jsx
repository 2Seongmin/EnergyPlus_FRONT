import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Wrapper,
  HeaderRow,
  Title,
  StyledTable,
  Pagination,
  PageBtn,
} from "../../TableStyle/Table.style";
import AdminSidebar from "../AdminSidebar";
import global from "../../../../conf";

const MileageList = () => {
  const [mileages, setMileages] = useState([]);
  const [pageNo, setPageNo] = useState(0);

  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();
  const apiUrl = global.API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/admin/mileages?page=${pageNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMileages(res.data);
        console.log(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.error("마일리지 목록 불러오기 실패", err);
      });
  }, [pageNo]);

  return (
    <Wrapper>
      <AdminSidebar />
      <HeaderRow>
        <Title>마일리지 인증 신청 목록</Title>
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
          {mileages.map((m) => (
            <tr
              key={m.mileageSeq}
              onClick={() => navigate(`/admin/mileage/${m.mileageSeq}`)}
            >
              <td>{m.mileageSeq}</td>
              <td>{m.mileageCategory}</td>
              <td>{m.userName}</td>
              <td>{m.createDate}</td>
              <td
                style={{
                  color: m.mileageStatus === "N" ? "red" : "black",
                  fontWeight: m.mileageStatus === "N" ? "bold" : "normal",
                }}
              >
                {m.mileageStatus === "N" ? "확인중" : "답변완료"}
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>

      {/* 페이징 처리 유동적으로 수정하기 */}
      <Pagination>
        <PageBtn onClick={() => setPageNo((prev) => Math.max(prev - 1, 0))}>
          &lt;&lt;
        </PageBtn>
        {[0, 1, 2].map((n) => (
          <PageBtn
            key={n}
            onClick={() => setPageNo(n)}
            style={{ fontWeight: pageNo === n ? "bold" : "normal" }}
          >
            {n + 1}
          </PageBtn>
        ))}
        <PageBtn onClick={() => setPageNo((prev) => prev + 1)}>
          &gt;&gt;
        </PageBtn>
      </Pagination>
    </Wrapper>
  );
};

export default MileageList;
