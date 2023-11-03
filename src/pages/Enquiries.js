import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { deleteAEnquiry, getEnquiries, resetState, updateAEnquiry } from '../features/enquiry/enquirySlice';
import { Link } from 'react-router-dom';
import { AiFillDelete, AiOutlineEye } from 'react-icons/ai';
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
    title: "Trạng thái",
    dataIndex: "status",
  },
  {
    title: "Hành động",
    dataIndex: "action",
  },
];

const Enquiries = () => {
  const [open, setOpen] = useState(false);
  const [enqId, setEnqId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setEnqId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEnquiries());
  }, [])

  const enqState = useSelector((state) => state.enquiry.enquiries);
  const data1 = [];
  for (let i = 0; i < enqState.length; i++) {
    data1.push({
      key: i + 1,
      name: enqState[i].name,
      email: enqState[i].email,
      mobile: enqState[i].mobile,
      status: (
        <>
          <select
            name=''
            defaultValue={enqState[i].status ? enqState[i].status : "Submitted"}
            className='form-control form-select'
            id=''
            onChange={(e) => setEnquiryStatus(e.target.value, enqState[i]._id)}
          >
            <option value="Submitted">Submitted</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </>
      ),
      action: (
        <>
          <Link to={`/admin/enquiries/${enqState[i]._id}`}
            className='ms-3 fs-3 text-danger'>
            <AiOutlineEye />
          </Link>
          <button
            className='ms-3 fs-3 text-danger bg-transparent border-0'
            onClick={() => showModal(enqState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      )
    });
  }
  const setEnquiryStatus = (e, i) => {
    const data = { id: i, enqData: e };
    dispatch(updateAEnquiry(data));
  };
  const deleteEnq = (e) => {
    dispatch(deleteAEnquiry(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(resetState());
      dispatch(getEnquiries());
    }, 100);
  }
  return (
    <div>
      <h3 className='mb-4 title'>Góp ý</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteEnq(enqId)}
        title="Bạn chắc chắn muốn xóa góp ý này??"
      />
    </div>
  )
}

export default Enquiries
