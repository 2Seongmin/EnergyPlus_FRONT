import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 40px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const SearchBox = styled.div`
  display: flex;
  gap: 5px;
`;

// 검색
export const SearchInput = styled.input`
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// 검색 버튼
export const SearchButton = styled.button`
  background-color: #408c70;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
`;

// 글 작성 버튼
export const WriteButton = styled.button`
  border: 1px solid #408c70;
  background-color: white;
  color: #408c70;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #408c70;
    color: white;
  }
`;

// 테이블 스타일
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    font-size: 15px;
  }

  th {
    background-color: #f7f7f7;
    font-weight: 600;
  }

  thead > tr {
    border-top: 1px solid black;
  }

  tbody > tr {
    &:hover {
      background-color: rgb(241, 241, 241);
    }
  }

  .status-checking {
    color: #408c70;
    font-weight: bold;
  }
`;

// 페이지 처리
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 6px;
`;

// 페이지 버튼
export const PageBtn = styled.button`
  background-color: ${(props) => (props.active ? "#5EB3D3" : "white")};
  border: 1px solid #5eb3d3;
  color: ${(props) => (props.active ? "white" : "#5EB3D3")};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;

  &:hover {
    background-color: #5eb3d3;
    color: white;
  }
`;

// 뒤로가기
export const BackBtn = styled.button`
  width: 150px;
  height: 50px;
  background-color: white;
  color: #408c70;
  font-weight: bold;
  border: 1px solid #408c70;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  margin: auto;
  margin-top: 30px;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #408c70;
    color: white;
  }
`;

// ------------------------------ qna_detail style
// 글 삭제 버튼
export const DeleteButton = styled.button`
  background-color: #cd4749;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
`;

export const ContentDiv = styled.div`
  border: 1px solid #ccc;
  border-radius: 7px;
  padding: 35px;
`;

export const ContentTitle = styled.div`
  font-size: 27px;
  float: left;
`;

export const ContentDate = styled.div`
  font-size: 18px;
  float: right;
`;

export const ContentDetail = styled.div`
  font-size: 16px;
  margin-top: 20px;
`;

export const ContentCategory = styled.div`
  font-size: 27px;
  float: left;
`;

// ------------------------------ mypage_qna_form 글 작성/수정 부분
export const FooterRow = styled.div`
  text-align: center;
  display: inline-flex;
  gap: 10px;
`;
// title
export const UpdateInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 17px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #bbb;
`;
// content
export const UpdateTextarea = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 10px;
  font-size: 17px;
  box-sizing: border-box;
  resize: none;
  border-radius: 5px;
  border: 1px solid #bbb;
`;
// 수정하기
export const UpdateBtn = styled.button`
  width: 150px;
  height: 50px;
  background-color: #408c70;
  color: white;
  font-weight: bold;
  border: 1px solid #408c70;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  margin: auto;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
`;

// ------------------------------ mypage_qna 댓글 부분
export const ReplyDiv = styled.div`
  border: 1px solid rgb(114, 200, 168);
  border-radius: 7px;
  padding: 20px 35px;
  margin-top: 20px;
`;
export const ReplyTitle = styled.div`
  font-size: 16px;
  float: left;
`;
export const ReplyDate = styled.div`
  font-size: 16px;
  float: right;
`;
export const ReplyDetail = styled.div`
  font-size: 17px;
`;
export const Replybutton = styled.div`
  font-size: 16px;
  float: right;
`;
// 댓글 삭제
export const DeleteReply = styled.button`
  background-color: #cd4749;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
`;

// 댓글 등록칸
export const ReplyTextarea = styled.textarea`
  width: 90%;
  height: auto;
  font-size: 17px;
  resize: none;
  border-radius: 5px;
  border: 1px solid #bbb;
`;
