/* eslint-disable jsx-a11y/img-redundant-alt */
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
    title: "Ảnh",
    dataIndex: "image",
  },
  {
    title: "Tên Sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
  },
  {
    title: "Số lượng",
    dataIndex: "count",
  },
  {
    title: "Giá",
    dataIndex: "amount",
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalAmount",
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
      image: (
        <div className='product-image'>
          <img
            src={orderState[i]?.product?.images[0]?.url}
            className='img-fluid mx-auto'
            alt='product image'
            width={160}
            style={{ width: 96, height: 96 }}
          />
        </div>
      ),
      name: orderState[i].product?.title,
      brand: orderState[i].product?.brand,
      count: orderState[i].quantity,
      amount: (orderState[i].priceAfterDiscount).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
      totalAmount: (orderState[i].priceAfterDiscount * orderState[i].quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    });
  }
  const goBack = () => {
    navigate(-1);
  }
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h3 className='mb-4 title'>Chi tiết đơn hàng</h3>
        <button className='bg-transparent border-0 fs-6 mb-0 d-flex align-items-center gap-1' onClick={goBack}>
          <BiArrowBack className='fs-5' /> Trở lại
        </button>
      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  )
}

export default ViewOrder
