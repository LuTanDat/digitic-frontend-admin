/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useMemo } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getOrder, updateAOrder, getOrderByUser, getOrders } from '../features/auth/authSlice';
import { BiArrowBack } from 'react-icons/bi';
import StepOrderComponent from '../components/StepOrderComponent';

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

  const aOrderState = useSelector((state) => state?.auth?.singleOrder);
  const orderItemsState = useSelector((state) => state?.auth?.singleOrder?.orderItems);

  console.log(aOrderState);
  console.log(orderItemsState);

  const data1 = [];
  for (let i = 0; i < orderItemsState?.length; i++) {
    data1.push({
      key: i + 1,
      image: (
        <div className='product-image'>
          <img
            src={orderItemsState[i]?.product?.images[0]?.url}
            className='img-fluid mx-auto'
            alt='product image'
            width={160}
            style={{ width: 96, height: 96, display: "block", padding: "3px", border: "1px solid #ccc" }}
          />
        </div>
      ),
      name: orderItemsState[i].product?.title,
      brand: orderItemsState[i].product?.brand,
      count: orderItemsState[i].quantity,
      amount: (orderItemsState[i].priceAfterDiscount).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
      totalAmount: (orderItemsState[i].priceAfterDiscount * orderItemsState[i].quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    });
  }
  const goBack = () => {
    navigate(-1);
  }


  const orderStatus = useMemo(() => {
    if (aOrderState?.orderStatus === "Đã đặt hàng") {
      return 0
    }
    else if (aOrderState?.orderStatus === "Đang xử lý") {
      return 1
    }
    else if (aOrderState?.orderStatus === "Đang giao") {
      return 2
    }
    else if (aOrderState?.orderStatus === "Đã nhận hàng") {
      return 3
    }
    else if (aOrderState?.orderStatus === "Đã Hủy") {
      return 4
    }
  }, [aOrderState?.orderStatus])

  const itemsOrderStatus = [
    {
      title: 'Đã đặt hàng',
    },
    {
      title: 'Đang xử lý',
    },
    {
      title: 'Đang giao',
    },
    {
      title: 'Đã nhận hàng',
    },
    {
      title: 'Đã Hủy',
    },
  ]

  const updateOrderStatus = (a, b) => {
    dispatch(updateAOrder({ id: a, status: b }))
  }

  return (
    <div className='viewOrder'>
      <div className='d-flex justify-content-between align-items-center'>
        <h3 className='mb-4 title'>Chi tiết đơn hàng</h3>
        <button className='bg-transparent border-0 fs-6 mb-0 d-flex align-items-center gap-1' onClick={goBack}>
          <BiArrowBack className='fs-5' /> Trở lại
        </button>
      </div>
      <div className='my-3 text-center'>
        <StepOrderComponent items={itemsOrderStatus} current={orderStatus} />
      </div>
      <div className="d-flex mb-4 justify-content-around align-items-baseline info-order-detail-mobile">
        <div style={{ border: "1px solid #857575cc", borderRadius: "10px", padding: "15px", backgroundColor: "white", marginTop: "16px" }}>
          <h5>Địa chỉ nhận hàng</h5>
          <p>{`Người nhận: ${aOrderState?.shippingInfo?.lastName} ${aOrderState?.shippingInfo?.firstName}`}</p>
          <p>{`SĐT: ${aOrderState?.shippingInfo?.mobile}`}</p>
          <p className='mb-0'>{`Địa chỉ: ${aOrderState?.shippingInfo?.address}`}</p>
        </div>
        <div style={{ border: "1px solid #857575cc", borderRadius: "10px", padding: "15px", backgroundColor: "white", marginTop: "16px" }}>
          <h5>Thông tin đơn hàng</h5>
          <p>{`Mã đơn hàng: ${aOrderState?._id}`}</p>
          <p>{`Ngày đặt hàng: ${new Date(aOrderState?.createdAt).toLocaleString()}`}</p>
          <p>{`Phương thức thanh toán: ${aOrderState?.paymentMethod}`}</p>
          <p className='mb-0'>{`Thời gian thanh toán: ${aOrderState?.paidAt ? new Date(aOrderState?.paidAt).toLocaleString() : "Chưa Thanh toán"}`}</p>
        </div>

        <div>
          <h3>Cập nhật trạng thái</h3>
          {
            aOrderState?.orderStatus === 'Đã đặt hàng' ? (
              <select name='' defaultValue={aOrderState?.orderStatus} onChange={(e) => updateOrderStatus(aOrderState?._id, e.target.value)} id='' className='form-control form-select'>
                <option value="Đã đặt hàng" disabled>Đã đặt hàng</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đang giao" disabled>Đang giao</option>
                <option value="Đã nhận hàng" disabled>Đã nhận hàng</option>
                <option value="Đã Hủy" disabled>Đã Hủy</option>
              </select>
            ) : aOrderState?.orderStatus === 'Đang xử lý' ? (
              <select name='' defaultValue={aOrderState?.orderStatus} onChange={(e) => updateOrderStatus(aOrderState?._id, e.target.value)} id='' className='form-control form-select'>
                <option value="Đã đặt hàng" disabled>Đã đặt hàng</option>
                <option value="Đang xử lý" disabled>Đang xử lý</option>
                <option value="Đang giao">Đang giao</option>
                <option value="Đã nhận hàng" disabled>Đã nhận hàng</option>
                <option value="Đã Hủy" disabled>Đã Hủy</option>
              </select>
            ) : aOrderState?.orderStatus === 'Đang giao' ? (
              <select name='' defaultValue={aOrderState?.orderStatus} onChange={(e) => updateOrderStatus(aOrderState?._id, e.target.value)} id='' className='form-control form-select'>
                <option value="Đã đặt hàng" disabled>Đã đặt hàng</option>
                <option value="Đang xử lý" disabled>Đang xử lý</option>
                <option value="Đang giao" disabled>Đang giao</option>
                <option value="Đã nhận hàng">Đã nhận hàng</option>
                <option value="Đã Hủy" disabled>Đã Hủy</option>
              </select>
            ) : (
              <select name='' defaultValue={aOrderState?.orderStatus} onChange={(e) => updateOrderStatus(aOrderState?._id, e.target.value)} id='' className='form-control form-select' disabled>
                <option value="Đã đặt hàng" disabled>Đã đặt hàng</option>
                <option value="Đang xử lý" disabled>Đang xử lý</option>
                <option value="Đang giao" disabled>Đang giao</option>
                <option value="Đã nhận hàng" disabled>Đã nhận hàng</option>
                <option value="Đã Hủy" disabled>Đã Hủy</option>
              </select>
            )
          }
        </div>

      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <div className='m-3 text-end'>
        <p>{`Tổng tiền hàng: ${aOrderState?.itemsPrice ? (aOrderState?.itemsPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "0 đ"}`}</p>
        <p>{`Phí vận chuyển: ${aOrderState?.shippingPrice ? (aOrderState?.shippingPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "0 đ"}`}</p>
        <b>{`Thành tiền: ${aOrderState?.totalPrice ? (aOrderState?.totalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "0 đ"}`}</b>
      </div>
    </div>
  )
}

export default ViewOrder
