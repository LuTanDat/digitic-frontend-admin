import React, { useEffect, useState } from 'react';
import { BsArrowDownRight, BsArrowUpRight } from 'react-icons/bs';

import { Column } from '@ant-design/plots'; // chart column
import { Table } from "antd"; // Table
import { useDispatch, useSelector } from 'react-redux';
import { getMonthlyData, getYearlyData } from '../features/auth/authSlice';
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
];
const data1 = [];
for (let i = 0; i < 46; i++) {
  data1.push({
    key: i,
    name: `Edward King ${i}`,
    product: 32,
    status: `London, Park Lane no. ${i}`,
  });
}
const Dashboard = () => {

  const dispatch = useDispatch();
  const monthlyDataState = useSelector((state) => state?.auth?.monthlyData);
  const yearlyDataState = useSelector((state) => state?.auth?.yearlyData);
  const [dataMonthly, setDataMonthly] = useState([]);
  const [dataMonthlySales, setDataMonthlySales] = useState([]);
  useEffect(() => {
    dispatch(getMonthlyData());
    dispatch(getYearlyData());
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
            <p className='desc'>Total Income</p>
            <h4 className='mb-0 sub-title'>${yearlyDataState[0].amount}</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <p className='mb-0 desc'>Income in last year from today</p>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Total Sales</p>
            <h4 className='mb-0 sub-title'>{yearlyDataState[0].count}</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <p className='mb-0 desc'>Sales in last year from today</p>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between gap-3'>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-5 title'>Income Statics</h3>
          <div>
            <Column {...config} />
          </div>
        </div>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-5 title'>Sales Statics</h3>
          <div>
            <Column {...config2} />
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <h3 className='mb-5 title'>Recent Orders</h3>
        <div>
          <Table columns={columns} dataSource={data1} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
