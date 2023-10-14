import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from '../../utils/axiosconfig';

const login = async (user) => {
  const response = await axios.post(`${base_url}user/admin-login`, user);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data;
};

const getOrders = async () => {
  const response = await axios.get(`${base_url}user/getallorders`, config);

  return response.data;
};

const getOrder = async (id) => {
  const response = await axios.get(`${base_url}user/getorderbyuser/${id}`, config);

  return response.data;
};

const getMonthlyOrders = async () => {
  const response = await axios.get(`${base_url}user/getMonthWiseOrderIncome`, config);

  return response.data;
};

const getYearlyStats = async () => {
  const response = await axios.get(`${base_url}user/getYearlyTotalOrders`, config);

  return response.data;
};

const authService = {
  login,
  getOrders,
  getOrder,
  getMonthlyOrders,
  getYearlyStats,

}
export default authService;