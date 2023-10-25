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

const getOrders = async (data) => {
  const response = await axios.get(`${base_url}user/getallorders`, data);

  return response.data;
};

const getOrder = async (id) => {
  const response = await axios.get(`${base_url}user/getaOrder/${id}`, config);

  return response.data;
};

const updateOrder = async (data) => {
  const response = await axios.put(`${base_url}user/updateOrder/${data.id}`, { status: data.status }, config);

  return response.data;
};

const deleteOrder = async (id) => {
  const response = await axios.delete(`${base_url}user/deleteOrder/${id}`, config);

  return response.data;
};

const getMonthlyOrders = async (data) => {
  const response = await axios.get(`${base_url}user/getMonthWiseOrderIncome`, data);

  return response.data;
};

const getYearlyStats = async (data) => {
  const response = await axios.get(`${base_url}user/getYearlyTotalOrders`, data);

  return response.data;
};

const blockUser = async (data) => {
  // console.log(data.config2);
  const response = await axios.put(`${base_url}user/block-user/${data.id}`, data.config2);

  return response.data;
};

const unBlockUser = async (data) => {
  // console.log(data.config2);
  const response = await axios.put(`${base_url}user/unblock-user/${data.id}`, data.config2);

  return response.data;
};

const authService = {
  login,
  getOrders,
  getOrder,
  getMonthlyOrders,
  getYearlyStats,
  updateOrder,
  deleteOrder,
  blockUser,
  unBlockUser
}
export default authService;