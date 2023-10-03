import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getProductCategories = async () => {
  const response = await axios.get(`${base_url}category/`);
  // console.log(response);
  return response.data;
};

const pCategoryService = {
  getProductCategories,
}
export default pCategoryService;