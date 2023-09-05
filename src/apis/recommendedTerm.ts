import { instance } from "../configs/axios";

export const getRecommendedTerm = (inputTerm: string) => {
  return instance({
    url: `/sick?q=${inputTerm}`,
    method: "get",
  });
};
