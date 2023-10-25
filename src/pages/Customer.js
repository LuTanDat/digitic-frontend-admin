import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../features/customers/customerSlice';
import { blockUser, unBlockUser } from '../features/auth/authSlice'
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Tên",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "mobile",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
];

const Customer = () => {
  const getTokenFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
        }`,
      Accept: "application/json",
    },
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [])

  const customerstate = useSelector((state) => state?.customer?.customers);
  const data1 = [];
  for (let i = 0; i < customerstate.length; i++) {
    if (customerstate[i].role !== 'admin') {
      data1.push({
        key: i + 1,
        name: customerstate[i].firstName + " " + customerstate[i].lastName,
        email: customerstate[i].email,
        mobile: customerstate[i].mobile,
        status: (
          <>
            <select name='' defaultValue={customerstate[i]?.isBlocked} onChange={(e) => updateUserStatus(customerstate[i]?._id, e.target.value)} id='' className='form-control form-select'>
              <option value="false">Đang hoạt động</option>
              <option value="true">Khóa</option>
            </select>
          </>
        ),
      });
    }
  }
  const updateUserStatus = (id, status) => {
    // console.log(id, status);
    if (status === "true") {
      // console.log("Block a user");
      dispatch(blockUser({ id: id, config2: config2 }));
    }
    else {
      // console.log("Unblock a user");
      dispatch(unBlockUser({ id: id, config2: config2 }));
    }
  }
  return (
    <div>
      <h3 className='mb-4 title'>Khách hàng</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  )
}

export default Customer
