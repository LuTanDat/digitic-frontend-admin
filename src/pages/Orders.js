import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete, AiFillPrinter } from 'react-icons/ai';
import { deleteAOrder, getOrders, resetState, updateAOrder } from '../features/auth/authSlice';
import CustomModal from '../components/CustomModal';
import PieChartComponent from '../components/PieChartComponent';

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Tên người nhận",
    dataIndex: "name",
  },
  {
    title: "Sản phẩm",
    dataIndex: "product",
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "payment",
  },
  {
    title: "Tổng tiền",
    dataIndex: "amount",
  },
  {
    title: "Ngày đặt hàng",
    dataIndex: "date",
  },
  {
    title: "Trạng thái đơn hàng",
    dataIndex: "status",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
  },
];

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setOrderId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

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
  useEffect(() => {
    dispatch(resetState());
    dispatch(getOrders(config3));
  }, [])

  const orderState = useSelector((state) => state?.auth?.orders?.orders);
  const data1 = [];
  for (let i = 0; i < orderState?.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i]?.user?.firstName,
      product: (
        <Link to={`/admin/order/${orderState[i]?._id}`}>
          View Orders
        </Link>
      ),
      payment: orderState[i]?.paymentMethod,
      amount: orderState[i]?.totalPrice,
      date: new Date(orderState[i]?.createdAt).toLocaleString(),
      status: (
        <>
          <select name='' defaultValue={orderState[i]?.orderStatus} onChange={(e) => updateOrderStatus(orderState[i]?._id, e.target.value)} id='' className='form-control form-select'>
            <option value="Đã đặt hàng" disabled>Đã đặt hàng</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Giao thành công">Giao thành công</option>
            <option value="Đã Hủy">Hủy</option>
          </select>
        </>
      ),
      action: (
        <>
          <button
            className='me-3 fs-3 text-danger bg-transparent border-0'
            onClick={() => { }}
          >
            <AiFillPrinter />
          </button>
          {/* <Link to={`/admin/order/${orderState[i]._id}`}
            className='fs-3 text-danger'>
            <BiEdit />
          </Link> */}
          <button
            className='ms-3 fs-3 text-danger bg-transparent border-0'
            onClick={() => showModal(orderState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      )
    });
  }
  const updateOrderStatus = (a, b) => {
    dispatch(updateAOrder({ id: a, status: b }))
  }
  const deleteOrder = (e) => {
    dispatch(deleteAOrder(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getOrders(config3));
    }, 100);
  }
  return (
    <div>
      <h3 className='mb-3 title'>Đơn hàng</h3>
      <div className='mb-4' style={{ height: 200, width: 200 }}>
        <PieChartComponent data={orderState} /> {/*truyen vao danh sach don hang */}
      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteOrder(orderId)}
        title="Bạn chắc chắn muốn xóa đơn hàng này?"
      />
    </div>
  )
}

export default Orders
