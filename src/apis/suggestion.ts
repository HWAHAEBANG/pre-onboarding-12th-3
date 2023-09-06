import { instance } from "../configs/axios";

export const getSuggestionApi = (searchKeyword: string) => {
  if(searchKeyword === '') return Promise.resolve({data:[]});
  console.info("calling api")
  return instance({
    url: `/sick?q=${searchKeyword}`,
    method: "get",
  });
};
