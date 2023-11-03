import React, { useEffect, useState } from 'react';
import { BsArrowDownRight, BsArrowUpRight } from 'react-icons/bs';

import { Column } from '@ant-design/plots'; // chart column
import { Table } from "antd"; // Table
import { useDispatch, useSelector } from 'react-redux';
import { getMonthlyData, getOrders, getYearlyData } from '../features/auth/authSlice';

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Tên",
    dataIndex: "name",
  },
  {
    title: "Số lượng",
    dataIndex: "product",
  },
  {
    title: "Tổng giá",
    dataIndex: "price",
  },
  {
    title: "Tổng giá sau khuyến mãi",
    dataIndex: "dprice",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
];

const Dashboard = () => {
  const getTokenFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const config3 = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
        }`,
      Accept: "application/json",
    },
  };

  const dispatch = useDispatch();

  const monthlyDataState = useSelector((state) => state?.auth?.monthlyData);
  const yearlyDataState = useSelector((state) => state?.auth?.yearlyData);
  const orderState = useSelector((state) => state?.auth?.orders?.orders);

  const [dataMonthly, setDataMonthly] = useState([]);
  const [dataMonthlySales, setDataMonthlySales] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    dispatch(getOrders(config3));
    dispatch(getMonthlyData(config3));
    dispatch(getYearlyData(config3));
  }, [])

  useEffect(() => {
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let data = [];
    let monthlyOrderCount = [];
    for (let index = 0; index < monthlyDataState?.length; index++) {
      const element = monthlyDataState[index];
      data.push({ type: monthNames[element?._id?.month - 1], income: element?.amount })
      monthlyOrderCount.push({ type: monthNames[element?._id?.month - 1], sales: element?.count })
    }

    const data1 = [];
    for (let i = 0; i < orderState?.length; i++) {
      if (i < 10) {
        data1.push({
          key: i + 1,
          name: orderState[i]?.user?.firstName + orderState[i]?.user?.lastName,
          product: orderState[i]?.orderItems?.length,
          price: (orderState[i]?.totalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
          dprice: (orderState[i]?.totalPriceAfterDiscount).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
          status: orderState[i]?.orderStatus,
        });
      }
    }
    setOrderData(data1);
    setDataMonthly(data);
    setDataMonthlySales(monthlyOrderCount);

  }, [monthlyDataState])

  const config = {
    data: dataMonthly,
    xField: 'type',
    yField: 'income',
    // seriesField: '',
    color: ({ type }) => {
      return "#ffd333";
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: 'Month',
      },
      sales: {
        alias: 'Income',
      },
    },
  };

  const config2 = {
    data: dataMonthlySales,
    xField: 'type',
    yField: 'sales',
    // seriesField: '',
    color: ({ type }) => {
      return "#ffd333";
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: 'Month',
      },
      sales: {
        alias: 'Sales',
      },
    },
  };

  return (
    <div>
      <h3 className='mb-4 title'>Dashboard</h3>
      <div className='d-flex justify-content-between align-items-center gap-3'>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Tổng thu nhập</p>
            <h4 className='mb-0 sub-title'>{yearlyDataState && (yearlyDataState[0]?.amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <p className='mb-0 desc'>Thu nhập trong 1 năm qua</p>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Tổng đơn hàng</p>
            <h4 className='mb-0 sub-title'>{yearlyDataState && yearlyDataState[0]?.count}</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <p className='mb-0 desc'>Đơn hàng trong 1 năm qua</p>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between gap-3'>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-5 title'>Thống kê thu nhập</h3>
          <div>
            <Column {...config} />
          </div>
        </div>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-5 title'>Thống kê đơn hàng</h3>
          <div>
            <Column {...config2} />
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <h3 className='mb-5 title'>Đơn hàng gần đây</h3>
        <div>
          <Table columns={columns} dataSource={orderData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
