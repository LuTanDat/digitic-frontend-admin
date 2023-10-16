import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getOrder, getOrderByUser, getOrders } from '../features/auth/authSlice';
import { BiArrowBack } from 'react-icons/bi';

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Product Name",
    dataIndex: "name",
  },
  {
    title: "Brand",
    dataIndex: "brand",
  },
  {
    title: "Count",
    dataIndex: "count",
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  }
];

const ViewOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.pathname.split("/")[3];

  useEffect(() => {
    dispatch(getOrder(orderId));
  }, [])

  const orderState = useSelector((state) => state?.auth?.singleOrder?.orders?.orderItems);
  console.log(orderState);

  const data1 = [];
  for (let i = 0; i < orderState?.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i].product?.title,
      brand: orderState[i].product?.brand,
      count: orderState[i].quantity,
      color: orderState[i].color?.title,
      amount: orderState[i].price,
    });
  }
  const goBack = () => {
    navigate(-1);
  }
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h3 className='mb-4 title'>View Order</h3>
        <button className='bg-transparent border-0 fs-6 mb-0 d-flex align-items-center gap-1' onClick={goBack}>
          <BiArrowBack className='fs-5' /> Go Back
        </button>
      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  )
}

export default ViewOrder
