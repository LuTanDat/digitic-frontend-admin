import React, { useEffect, useState } from 'react';
import { Column, Bar, Pie } from '@ant-design/plots'; // chart column
import { Table } from "antd"; // Table
import { useDispatch, useSelector } from 'react-redux';
import { getCategoryRevenueData, getCountLowStockProducts, getInventoryStatsByCategory, getMonthlyData, getOrderStatusCounts, getOrders, getPaymentMethodCounts, getYearlyData } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';
import PieChartComponent from '../components/PieChartComponent';

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

  const orderState = useSelector((state) => state?.auth?.orders?.orders);
  const monthlyDataState = useSelector((state) => state?.auth?.monthlyData);
  const yearlyDataState = useSelector((state) => state?.auth?.yearlyData);
  const categoryRevenueDataState = useSelector((state) => state?.auth?.categoryRevenueData);
  const orderStatusCountsState = useSelector((state) => state?.auth?.orderStatusCountsData);
  const paymentMethodCountsState = useSelector((state) => state?.auth?.paymentMethodCountsData);
  const countLowStockProductsState = useSelector((state) => state?.auth?.countLowStockProducts);
  const inventoryStatsByCategoryState = useSelector((state) => state?.auth?.inventoryStatsByCategory);

  const [dataMonthly, setDataMonthly] = useState([]);
  const [dataMonthlySales, setDataMonthlySales] = useState([]);
  const [datacategoryRevenue, setDatacategoryRevenue] = useState([]);
  const [inventoryStatsByCategory, setInventoryStatsByCategory] = useState([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState([]);
  const [paymentMethodCounts, setPaymentMethodCounts] = useState([]);
  const [orderData, setOrderData] = useState([]);


  useEffect(() => {
    dispatch(getOrders(config3));
    dispatch(getMonthlyData(config3));
    dispatch(getYearlyData(config3));
    dispatch(getCategoryRevenueData(config3));
    dispatch(getOrderStatusCounts(config3));
    dispatch(getPaymentMethodCounts(config3));
    dispatch(getCountLowStockProducts(config3));
    dispatch(getInventoryStatsByCategory(config3));
  }, [])


  useEffect(() => {
    const data1 = [];
    for (let i = 0; i < orderState?.length; i++) {
      if (i < 10) {
        data1.push({
          key: i + 1,
          name: orderState[i]?.user?.firstName + orderState[i]?.user?.lastName,
          product: orderState[i]?.orderItems?.length,
          price: (orderState[i]?.totalPrice)?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
          status: orderState[i]?.orderStatus,
        });
      }
    }
    setOrderData(data1);
  }, [orderState])

  useEffect(() => {
    // let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
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

  useEffect(() => {
    let data = [];
    for (let index = 0; index < categoryRevenueDataState?.length; index++) {
      const element = categoryRevenueDataState[index];
      data.push({ type: element?._id, income: element?.totalRevenue })
    }
    setDatacategoryRevenue(data);
  }, [categoryRevenueDataState])

  useEffect(() => {
    let data = [];
    for (let index = 0; index < inventoryStatsByCategoryState?.length; index++) {
      const element = inventoryStatsByCategoryState[index];
      data.push({ type: element?._id, income: element?.totalQuantity })
    }
    setInventoryStatsByCategory(data);
  }, [inventoryStatsByCategoryState])

  useEffect(() => {
    let data = [];
    for (let index = 0; index < orderStatusCountsState?.length; index++) {
      const element = orderStatusCountsState[index];
      data.push({ type: element?._id, count: element?.count })
    }
    setOrderStatusCounts(data);
  }, [orderStatusCountsState])

  useEffect(() => {
    let data = [];
    for (let index = 0; index < paymentMethodCountsState?.length; index++) {
      const element = paymentMethodCountsState[index];
      data.push({ type: element?._id, count: element?.count })
    }
    setPaymentMethodCounts(data);
  }, [paymentMethodCountsState])


  const config = {
    data: dataMonthly,
    xField: 'type',
    yField: 'income',
    // seriesField: '',
    color: ({ type }) => {
      return "#0ee65f";
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
    yAxis: {
      label: {
        formatter: (v) => (Number(v).toLocaleString("vi-VN", { style: "currency", currency: "VND" })),
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
      return "#5a91ff";
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

  const config4 = {
    data: datacategoryRevenue,
    xField: 'income',
    yField: 'type',
    seriesField: 'type',
    legend: {
      position: 'top',
    },
    xAxis: {
      label: {
        formatter: (v) => (Number(v).toLocaleString("vi-VN", { style: "currency", currency: "VND" })),
      },
    },
  };

  const config6 = {
    data: inventoryStatsByCategory,
    xField: 'income',
    yField: 'type',
    seriesField: 'type',
    legend: {
      position: 'top',
    }
  };

  const config5 = {
    appendPadding: 10,
    data: orderStatusCounts,
    angleField: 'count',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: '',
      },
    },
    legend: {
      position: 'top',
    },
  };

  const config7 = {
    appendPadding: 10,
    data: paymentMethodCounts,
    angleField: 'count',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: '',
      },
    },
    legend: {
      position: 'top',
    },
  };


  return (
    <div className='dashboard'>
      <h3 className='mb-4 title'>Dashboard</h3>
      <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 total-revenue-mobile'>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 p-3 rounded-3 mt-2 border' style={{ backgroundColor: "#62d9aa" }}>
          <div>
            <p className='desc'>Tổng doanh thu trong 1 năm qua</p>
            <h4 className='mb-0 sub-title'>{yearlyDataState && yearlyDataState?.length !== 0 ? (yearlyDataState[yearlyDataState.length - 1]?.amount)?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "0 đ"}</h4>
          </div>
          <div>
            <p className='desc'>Đơn hàng</p>
            <h4 className='mb-0 sub-title'>{yearlyDataState && yearlyDataState?.length !== 0 ? yearlyDataState[yearlyDataState.length - 1]?.count : 0}</h4>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 p-3 rounded-3 mt-2 border' style={{ backgroundColor: "#62d9aa" }}>
          <div>
            <p className='desc'>Tổng doanh thu trong 1 tháng qua</p>
            <h4 className='mb-0 sub-title'>{monthlyDataState && monthlyDataState?.length !== 0 ? (monthlyDataState[monthlyDataState.length - 1]?.amount)?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "0 đ"}</h4>
          </div>
          <div>
            <p className='desc'>Đơn hàng</p>
            <h4 className='mb-0 sub-title'>{monthlyDataState && monthlyDataState?.length !== 0 ? monthlyDataState[monthlyDataState.length - 1]?.count : 0}</h4>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 p-3 rounded-3 mt-2 border' style={{ backgroundColor: "red" }}>
          <Link to="/admin/list-product" className='text-decoration-none w-100'>
            <p className='desc text-white'>Sản phẩm sắp hết hàng</p>
            <h4 className='mb-0 sub-title text-white'>{countLowStockProductsState}</h4>
          </Link>
        </div>
      </div>
      <div className='d-flex justify-content-between gap-3 mt-1 total-chart-mobile'>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-3 title'>Doanh thu theo tháng</h3>
          <div>
            <Column {...config} />
          </div>
        </div>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-3 title'>Đơn hàng theo tháng</h3>
          <div>
            <Column {...config2} />
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between gap-3 mt-1 total-chart-mobile'>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-3 title'>Doanh thu theo Danh mục</h3>
          <div>
            <Bar {...config4} />
          </div>
        </div>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-3 title'>Hàng tồn theo Danh mục</h3>
          <div>
            <Bar {...config6} />
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between gap-3 mt-2 total-chart-mobile'>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-3 title'>Trạng thái đơn hàng</h3>
          <div style={{ height: "300px" }}>
            <Pie {...config5} />
          </div>
        </div>
        <div className='mt-4 flex-grow-1 w-50'>
          <h3 className='mb-3 title'>Phương thức thanh toán</h3>
          <div style={{ height: "300px" }}>
            <Pie {...config7} />
          </div>
        </div>
      </div>

      {/* <div className='mt-4'>
        <h3 className='mb-5 title'>Đơn hàng gần đây</h3>
        <div>
          <Table columns={columns} dataSource={orderData} />
        </div>
      </div> */}
    </div>
  )
}

export default Dashboard
