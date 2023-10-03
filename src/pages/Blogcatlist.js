import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../features/bcategory/bcategorySlice';
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
    title: "Action",
    dataIndex: "action",
  },
];

const Blogcatlist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, [])

  const bCatstate = useSelector((state) => state.bCategory.bCategories);
  const data1 = [];
  for (let i = 0; i < bCatstate.length; i++) {
    data1.push({
      key: i + 1,
      name: bCatstate[i].title,
      action: (
        <>
          <Link to='list-blogcategory' className='fs-3 text-danger'>
            <BiEdit />
          </Link>
          <Link to='list-blogcategory' className='ms-3 fs-3 text-danger'>
            <AiFillDelete />
          </Link>
        </>
      )
    });
  }
  return (
    <div>
      <h3 className='mb-4 title'>Blog category List</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  )
}

export default Blogcatlist
