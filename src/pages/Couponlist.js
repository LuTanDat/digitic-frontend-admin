import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { deleteACoupon, getAllCoupons, resetState } from '../features/coupon/couponSlice';
import { Link } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import CustomModal from '../components/CustomModal';

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "% Khuyến mãi",
    dataIndex: "discount",
    sorter: (a, b) => a.discount - b.discount,
  },
  {
    title: "Ngày bắt đầu",
    dataIndex: "start",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Ngày kết thúc",
    dataIndex: "expiry",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Hành động",
    dataIndex: "action",
  },
];

const Couponlist = () => {
  const [open, setOpen] = useState(false);
  const [couponId, setCouponId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setCouponId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getAllCoupons());
  }, [])

  const couponState = useSelector((state) => state.coupon.coupons);
  const data1 = [];
  for (let i = 0; i < couponState.length; i++) {
    data1.push({
      key: i + 1,
      name: couponState[i].product?.title,
      discount: couponState[i].discount,
      start: new Date(couponState[i].start).toLocaleString(),
      expiry: new Date(couponState[i].expiry).toLocaleString(),
      action: (
        <>
          <Link
            to={`/admin/coupon/${couponState[i].product?._id}`}
            className='fs-4'
            style={{ color: "rgb(47, 34, 34)" }}
          >
            <BiEdit />
          </Link>
          <button
            className='ms-1 fs-4 text-danger bg-transparent border-0'
            onClick={() => showModal(couponState[i]?._id)}
          >
            <AiFillDelete />
          </button>
        </>
      )
    });
  }
  const deleteCoupon = (e) => {
    dispatch(deleteACoupon(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getAllCoupons());
    }, 100);
  }
  return (
    <div className='coupons'>
      <h3 className='mb-4 title'>Mã giảm giá</h3>
      <di4>
        <Table columns={columns} dataSource={data1} />
      </di4>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteCoupon(couponId)}
        title="Bạn chắc chắn muốn xóa Mã giảm giá này?"
      />
    </div>
  )
}

export default Couponlist
