const isolatedKoreanCharacterRegex = /[ㄱ-ㅎㅏ-ㅣ]$/;

export const isolatedKoreanCharacterValidator = (searchKeyword: string) => {
  return isolatedKoreanCharacterRegex.test(searchKeyword);
};
