import React, { useEffect } from 'react';
import { Table } from "antd";
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../features/product/productSlice';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Brand",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, [])

  const productstate = useSelector((state) => state.product.products);
  const data1 = [];
  for (let i = 0; i < productstate.length; i++) {
    data1.push({
      key: i + 1,
      title: productstate[i].title,
      brand: productstate[i].brand,
      category: productstate[i].category,
      color: productstate[i].color,
      price: `${productstate[i].price}`,
      action: (
        <>
          <Link to='list-product' className='fs-3 text-danger'>
            <BiEdit />
          </Link>
          <Link to='list-product' className='ms-3 fs-3 text-danger'>
            <AiFillDelete />
          </Link>
        </>
      )
    });
  }
  return (
    <div>
      <h3 className='mb-4 title'>Products</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  )
}

export default Productlist
