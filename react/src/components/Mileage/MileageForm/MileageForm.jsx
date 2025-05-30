import React, { useState } from "react";
import styled from "styled-components";
import global from "../../../../conf";

const MileageForm = () => {
  const [mileageTitle, setTitle] = useState("");
  const [mileageCategory, setCategory] = useState("");
  const [mileageContent, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileDescription, setFileDescription] = useState("");
  const token = sessionStorage.getItem("accessToken");
  const API_URL = global.API_URL;

  const enrollButton = async () => {
    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("mileageTitle", mileageTitle);
    formData.append("mileageCategory", mileageCategory);
    formData.append("mileageContent", mileageContent);
    formData.append("mileageImg", file);
    formData.append("fileDescription", fileDescription);

    try {
      const response = await fetch(`${API_URL}/mileages/save`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("마일리지 신청이 완료되었습니다!");
      } else {
        alert("신청 실패: 서버 응답이 실패했습니다.");
      }
    } catch (error) {
      console.error("제출 중 오류 발생:", error);
      alert("서버 연결 중 오류가 발생했습니다.");
    }
  };

  return (
    <MileageFormLayout>
      <FormTop>마일리지 적립 신청</FormTop>
      <FormBody>
        <RowHorizontal>
          <Column>
            <Label>제목</Label>
            <Input
              type="text"
              placeholder="제목을 입력하세요"
              value={mileageTitle}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Column>
          <Column>
            <Label>카테고리</Label>
            <Select
              value={mileageCategory}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">카테고리</option>
              <option value="자전거">자전거</option>
              <option value="다회용기">다회용기</option>
              <option value="기타">기타</option>
            </Select>
          </Column>
        </RowHorizontal>

        <Row>
          <Label>설명</Label>
          <Textarea
            placeholder="환경 보호를 위한 행동을 작성해주세요."
            value={mileageContent}
            onChange={(e) => setContent(e.target.value)}
          />
        </Row>

        <Row>
          <Label>인증 사진 설명</Label>
          <Textarea
            placeholder="사진이 잘 안보일 경우를 대비해 간단한 설명을 작성해주세요."
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
          />
        </Row>

        <Row>
          <Label>파일 업로드</Label>
          <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </Row>
      </FormBody>
      <ButtonLayout>
        <SubmitButton onClick={enrollButton}>등록하기</SubmitButton>
      </ButtonLayout>
    </MileageFormLayout>
  );
};

export default MileageForm;

const MileageFormLayout = styled.div`
  margin: 57px 0;
`;

const FormTop = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
`;

const FormBody = styled.div`
  background-color: #e4f2cd;
  padding: 40px;
  border-radius: 10px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RowHorizontal = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  font-weight: bold;
  background-color: #d3d3d3;
  padding: 0 8px;
  border-radius: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 10px;
  height: 30px;
  border: none;
  background-color: #ffffff;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 10px;
  background-color: #ffffff;
  border: none;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border-radius: 10px;
  height: 100px;
  resize: none;
  background-color: #ffffff;
  border: none;
`;

const ButtonLayout = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 12px;
  border-radius: 16px;
  background: #408c70;
  width: 140px;
  height: 50px;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #3b835f;
  }
`;
