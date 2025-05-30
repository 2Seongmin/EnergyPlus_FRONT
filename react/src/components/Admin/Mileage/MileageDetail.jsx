import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Wrapper,
  HeaderRow,
  Title,
  ContentDiv,
  ContentTitle,
  ContentDate,
  ContentDetail,
  BackBtn,
} from "../../TableStyle/Table.style";
import styled from "styled-components";
import global from "../../../../conf";

const MileageDetail = () => {
  const { mileageSeq } = useParams();
  const navigate = useNavigate();
  const [mileage, setMileage] = useState(null);
  const [showCategory, setShowCategory] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [mileageReject, setMileageReject] = useState("");
  const [mileageScore, setMileageScore] = useState("");
  const apiUrl = global.API_URL;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await axios.get(`${apiUrl}/admin/mileages/${mileageSeq}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        setMileage(res.data);
      } catch (err) {
        console.error("마일리지 상세 불러오기 실패", err);
      }
    };

    fetchDetail();
  }, [mileageSeq]);

  const handleApproveClick = () => {
    setShowCategory(true);
    setShowRejectReason(false);
  };

  const handleRejectClick = () => {
    setShowCategory(false);
    setShowRejectReason(true);
  };

  const handleGivePoint = async () => {
    if (!mileageScore) {
      alert("포인트를 입력하세요.");
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      await axios.post(
        `${apiUrl}admin/mileages/${mileageSeq}/status`,
        {
          mileageSeq: Number(mileageSeq), // 이거 꼭 있어야 백엔드에서 DTO에 바인딩됨
          mileageScore: Number(mileageScore),
        },

        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      console.log(mileageScore);
      alert("포인트가 지급되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("포인트 지급 실패", err);
      alert("포인트 지급 중 오류가 발생했습니다.");
    }
  };

  const handleRejectSubmit = async () => {
    if (!mileageReject.trim()) {
      alert("반려 사유를 입력하세요.");
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      await axios.post(
        `${apiUrl}/admin/mileages/${mileageSeq}/statusReject`,
        {
          mileageReject,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("반려 처리되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("반려 처리 실패", err);
      alert("반려 처리 중 오류가 발생했습니다.");
    }
  };

  if (!mileage) return <Wrapper>로딩 중...</Wrapper>;

  return (
    <Wrapper>
      <HeaderRow>
        <Title>{mileage.userName} 님의 마일리지 신청</Title>
      </HeaderRow>

      <ContentDiv>
        <HeaderRow>
          <ContentTitle>{mileage.mileageTitle || "제목 없음"}</ContentTitle>
          <ContentDate>No: {mileage.createDate}</ContentDate>
        </HeaderRow>
        <hr />
        <ContentDetail>
          <div>{mileage.mileageCategory || "카테고리 없음"}</div>
          {mileage.mileageImg ? (
            <div style={{ marginTop: "2rem" }}>
              <img
                src={`${apiUrl}${mileage.mileageImg}`}
                alt="마일리지 이미지"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </div>
          ) : (
            <p>이미지가 없습니다.</p>
          )}
          <div
            style={{ marginTop: "1rem" }}
            dangerouslySetInnerHTML={{
              __html: mileage.mileageContent.replace(/\r\n/g, "<br/>"),
            }}
          />
          <br />
          <strong>상태:</strong>{" "}
          {mileage.mileageStatus === "N" ? "확인중" : "답변완료"}
        </ContentDetail>
      </ContentDiv>

      <BackBtn onClick={() => navigate(-1)}>뒤로가기</BackBtn>

      <div>
        <ActionButtonRow>
          <ActionBtn onClick={handleApproveClick}>지급하기</ActionBtn>
          <ActionBtn onClick={handleRejectClick}>반려하기</ActionBtn>
        </ActionButtonRow>

        <ActionDiv>
          {showCategory && (
            <>
              <CategorySelect>{mileage.mileageCategory}</CategorySelect>

              <PointInput>
                <label>지급할 포인트: </label>
                <input
                  type="number"
                  placeholder="숫자를 입력하세요"
                  value={mileageScore}
                  onChange={(e) => setMileageScore(e.target.value)}
                />
                💰
                <SubmitBtn onClick={handleGivePoint}>포인트 지급하기</SubmitBtn>
              </PointInput>
            </>
          )}

          {showRejectReason && (
            <div>
              <CategorySelect>{mileage.mileageCategory}</CategorySelect>
              <RejectInput>
                <label>반려 사유: </label>
                <input
                  type="text"
                  placeholder="반려 사유를 입력하세요"
                  value={mileageReject}
                  onChange={(e) => setMileageReject(e.target.value)}
                />
                <SubmitBtn onClick={handleRejectSubmit}>
                  반려 처리하기
                </SubmitBtn>
              </RejectInput>
            </div>
          )}
        </ActionDiv>
      </div>
    </Wrapper>
  );
};

export default MileageDetail;

const ActionButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionBtn = styled.button`
  padding: 0.5rem 1.2rem;
  background-color: #2c6e49;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #235437;
  }
`;

const CategorySelect = styled.div`
  text-align: center;
  font-size: 1.1rem;
  border-radius: 12px;
  width: 132px;
  height: auto;
  color: white;
  padding: 5px 0;
  background: #5c9767;
`;

const inputStyle = `
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #999;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2c6e49;
  }
`;

const PointInput = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    ${inputStyle}
    width: 150px;
  }
`;

const RejectInput = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    ${inputStyle}
    width: 300px;
  }
`;

const SubmitBtn = styled.button`
  padding: 0.5rem 1.2rem;
  background-color: #bd1e1e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    background-color: #a11414;
  }
`;

const ActionDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid #000;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;
