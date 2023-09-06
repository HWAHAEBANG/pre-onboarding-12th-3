import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useContext,
  useState,
} from "react";
import { styled } from "styled-components";
import { getSuggestionApi } from "../apis/suggestion";
import { isolatedKoreanCharacterValidator } from "../utils/validator";
import SuggestionBox from "../components/SuggestionBox";
import { Suggestions } from "../types/searchType";
import { CacheContextValue } from "../types/customCacheType";
import { CustomCacheContext } from "../contexts/customCacheContext";

const SearchBar = () => {
  const cacheContextValue = useContext<CacheContextValue | undefined>(
    CustomCacheContext,
  );

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestions>([]);
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const [suggestionBoxVisible, setSuggestionBoxVisible] =
    useState<boolean>(false);

  const changeSearchInputValue = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    OpenSuggestionBox();
    setSearchKeyword(inputValue);
    setFocusIndex(-1);
    if (isolatedKoreanCharacterValidator(inputValue)) return;
    //====
    // 캐시에서 데이터 조회
    const cachedData = cacheContextValue?.get(inputValue);

    if (cachedData) {
      console.info("Data found in cache");
      setSuggestions(cachedData);
    } else {
      const response = await getSuggestionApi(inputValue);
      const data = response.data;
      cacheContextValue?.set(inputValue, data);
      setSuggestions(data);
    }
  };

  const startSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchKeyword === "") return alert("검색어를 입력하세요.");
    alert(`검색: ${searchKeyword}`);
    setSearchKeyword("");
    setFocusIndex(-1);
    CloseSuggestionBox();
    setSuggestions([]);
  };

  const clearSerchKeyword = () => {
    setSearchKeyword("");
    setFocusIndex(-1);
    CloseSuggestionBox();
    setSuggestions([]);
  };

  const OpenSuggestionBox = () => {
    setSuggestionBoxVisible(true);
  };

  const CloseSuggestionBox = () => {
    setSuggestionBoxVisible(false);
  };

  const moveFocus = (e: KeyboardEvent<HTMLInputElement>) => {
    // IME 입력 처리 중인지 확인
    if (e.key === "Process" || e.code === "Process") {
      return; // IME 입력 처리 중이면 아무 작업도 하지 않음
    }

    switch (e.code) {
      case "ArrowUp":
        if (focusIndex <= 0) {
          setFocusIndex(suggestions.length - 1);
          setSearchKeyword(suggestions[suggestions.length - 1].sickNm);
        } else {
          setFocusIndex((prev) => prev - 1);
          setSearchKeyword(suggestions[focusIndex - 1].sickNm);
        }
        break;
      case "ArrowDown":
        if (focusIndex >= suggestions.length - 1) {
          setFocusIndex(0);
          setSearchKeyword(suggestions[0].sickNm);
        } else {
          setFocusIndex((prev) => prev + 1);
          setSearchKeyword(suggestions[focusIndex + 1].sickNm);
        }
        break;
      case "Escape":
        CloseSuggestionBox();
        setFocusIndex(0);
        break;
      default:
        break;
    }
  };

  return (
    <SearchContainer>
      <StyledForm onSubmit={startSearch}>
        <StyledInput
          type="text"
          value={searchKeyword}
          onChange={changeSearchInputValue}
          onFocus={OpenSuggestionBox}
          // onBlur={CloseSuggestionBox}
          onKeyDown={moveFocus}
          placeholder="질환명을 입력해 주세요."
        />
        <SearchButton type="submit"><svg viewBox="0 0 16 16" fill="currentColor" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.56 0a6.56 6.56 0 015.255 10.49L16 14.674 14.675 16l-4.186-4.184A6.56 6.56 0 116.561 0zm0 1.875a4.686 4.686 0 100 9.372 4.686 4.686 0 000-9.372z"/></svg></SearchButton>
        <ClearButton onClick={clearSerchKeyword}>x</ClearButton>
        {suggestionBoxVisible ? (
          <SuggestionBox focusIndex={focusIndex} suggestions={suggestions} />
        ) : (
          ""
        )}
      </StyledForm>
    </SearchContainer>
  );
};

export default SearchBar;

const SearchContainer = styled.main`
  background-color: #cae9ff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled.form`
  position: relative;
  width: 500px;
  max-height: 300px;
`;

const StyledInput = styled.input`
  width: 500px;
  height: 50px;
  padding-left: 20px;
  border: none;
  border-radius: 50px;
  box-sizing: border-box;

  &:focus {
    outline: 2px solid #007be9;
  }
`;

const SearchButton = styled.button`
  background-color: #007be9;
  position: absolute;
  right: 10px;
  top: 5px;
  width: 40px;
  height: 40px;
  padding: 10px;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
`;

const ClearButton = styled.div`
  background-color: #c3c2c2;
  position: absolute;
  top: 15px;
  right: 60px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: white;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
`;
