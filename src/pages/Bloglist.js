import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { getBlogs } from '../features/blog/blogSlice';
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
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Bloglist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBlogs());
  }, [])

  const blogstate = useSelector((state) => state.blog.blogs);
  const data1 = [];
  for (let i = 0; i < blogstate.length; i++) {
    if (blogstate[i].role !== 'admin') {
      data1.push({
        key: i + 1,
        name: blogstate[i].title,
        category: blogstate[i].category,
        action: (
          <>
            <Link to='list-blog' className='fs-3 text-danger'>
              <BiEdit />
            </Link>
            <Link to='list-blog' className='ms-3 fs-3 text-danger'>
              <AiFillDelete />
            </Link>
          </>
        )
      });
    }
  }
  return (
    <div>
      <h3 className='mb-4 title'>Blog List</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  )
}

export default Bloglist
