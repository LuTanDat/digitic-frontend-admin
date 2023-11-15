import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { deleteASupplier, getSuppliers, resetState } from '../features/supplier/supplierSlice';
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
    title: "Địa chỉ",
    dataIndex: "address",
  },
  {
    title: "Hành động",
    dataIndex: "action",
  },
];

const Supplierlist = () => {
  const [open, setOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setSupplierId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getSuppliers());
  }, [])

  const supplierState = useSelector((state) => state.supplier.suppliers);
  const data1 = [];
  for (let i = 0; i < supplierState.length; i++) {
    data1.push({
      key: i + 1,
      name: supplierState[i].name,
      email: supplierState[i].email,
      mobile: supplierState[i].mobile,
      address: supplierState[i].address,
      action: (
        <>
          <Link
            to={`/admin/supplier/${supplierState[i]._id}`}
            className='fs-4'
            style={{ color: "rgb(47, 34, 34)" }}
          >
            <BiEdit />
          </Link>
          <button
            className='fs-4 text-danger bg-transparent border-0'
            onClick={() => showModal(supplierState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      )
    });
  }
  const deleteSupplier = (e) => {
    dispatch(deleteASupplier(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getSuppliers());
    }, 100);
  }
  return (
    <div className='suppliers'>
      <h3 className='mb-4 title'>Nhà cung cấp</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteSupplier(supplierId)}
        title="Bạn chắc chắn muốn xóa Nhà cung cấp này??"
      />
    </div>
  )
}

export default Supplierlist
