import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { getAllCoupons } from '../features/coupon/couponSlice';
import { Link } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Discount",
    dataIndex: "discount",
    sorter: (a, b) => a.discount - b.discount,
  },
  {
    title: "Expiry",
    dataIndex: "expiry",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Couponlist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCoupons());
  }, [])

  const couponstate = useSelector((state) => state.coupon.coupons);
  const data1 = [];
  for (let i = 0; i < couponstate.length; i++) {
    data1.push({
      key: i + 1,
      name: couponstate[i].name,
      discount: couponstate[i].discount,
      expiry: new Date(couponstate[i].expiry).toLocaleString(),
      action: (
        <>
          <Link to='list-coupon' className='fs-3 text-danger'>
            <BiEdit />
          </Link>
          <Link to='list-coupon' className='ms-3 fs-3 text-danger'>
            <AiFillDelete />
          </Link>
        </>
      )
    });
  }
  return (
    <div>
      <h3 className='mb-4 title'>Coupons</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  )
}

export default Couponlist
