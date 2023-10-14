import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import { getOrder, getOrderByUser, getOrders } from '../features/auth/authSlice';

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
  return (
    <div>
      <h3 className='mb-4 title'> View Order</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  )
}

export default ViewOrder
