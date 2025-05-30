import { useState } from "react";
import { SearchBox, SearchInput, SearchButton, WriteButton } from "../TableStyle/Table.style";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ initialKeyword, onSearchConfirm }) => {
  const [keyword, setKeyword] = useState(initialKeyword || "");
  const navi = useNavigate();

  const handleSearch = () => {
    onSearchConfirm(keyword); // 부모로 확정된 keyword 전달
  };

  const resetSearch = () => {
    setKeyword("");
    onSearchConfirm(""); // 검색어 초기화 시 부모에도 빈 문자열 전달
  };

  return (
    <SearchBox>
      <SearchInput
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <SearchButton onClick={handleSearch}>검색</SearchButton>
      {keyword.length > 0 && <SearchButton onClick={resetSearch}>초기화</SearchButton>}
      <WriteButton onClick={() => navi("/mypage_qna_write")}>글 작성</WriteButton>
    </SearchBox>
  );
};

export default SearchBar;
