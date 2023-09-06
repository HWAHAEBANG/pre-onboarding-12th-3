import {
  Dispatch,
  FC,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { styled } from "styled-components";
import { Suggestions } from "../types/searchType";

interface Props {
  focusIndex: number;
  suggestions: Suggestions;
}

const SuggestionBox: FC<Props> = ({ focusIndex, suggestions }) => {
  const liRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (liRef.current) {
      liRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusIndex]);

  return (
    <StyledSuggestionBox>
      <StyledParagraph>추천 검색어</StyledParagraph>
      <StyledListBox>
        <StyledUl>
          {suggestions.length === 0 ? <StyledLi>검색어 없음</StyledLi> : ""}
          {suggestions.map((suggestion, index) => (
            <StyledLi
              key={index}
              className={index === focusIndex ? "focus" : ""}
              onClick={() => alert(`검색: ${suggestion.sickNm}`)}
              ref={(el) => {
                if (index === focusIndex) {
                  liRef.current = el;
                }
              }}
            >
              <p>{suggestion.sickNm}</p>
            </StyledLi>
          ))}
        </StyledUl>
      </StyledListBox>
    </StyledSuggestionBox>
  );
};

export default SuggestionBox;

const StyledSuggestionBox = styled.div`
  background-color: white;
  position: absolute;
  top: 50px;
  left: 0;
  width: 500px;
  margin-top: 10px;
  padding-bottom: 25px;
  border-radius: 25px;
`;

const StyledListBox = styled.div`
  max-height: 250px;
  overflow-y: auto;
`;

const StyledUl = styled.ul`
  margin: 0;
  padding: 0;
`;

const StyledLi = styled.li`
  display: flex;
  padding: 0 15px;
  cursor: pointer;

  &:hover {
    background-color: #eeeeee;
  }

  &.focus {
    background-color: #eeeeee;
  }
`;

const StyledParagraph = styled.div`
  height: 30px;
  padding-left: 15px;
  line-height: 30px;
  font-size: 12px;
`;
