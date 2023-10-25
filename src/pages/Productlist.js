import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { RiCoupon5Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAProduct, getProducts, resetState } from '../features/product/productSlice';
import CustomModal from '../components/CustomModal';

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
    title: "Tên",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Danh mục",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Giá",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Giảm giá",
    dataIndex: "coupons",
    sorter: (a, b) => a.coupons - b.coupons,
  },
  {
    title: "Bảo hành",
    dataIndex: "warranty",
    sorter: (a, b) => a.warranty - b.warranty,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setProductId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getProducts());
  }, []);
  const productState = useSelector((state) => state.product.products);
  const data1 = [];
  for (let i = 0; i < productState.length; i++) {
    data1.push({
      key: i + 1,
      image: productState[i].image,
      title: productState[i].title,
      brand: productState[i].brand,
      category: productState[i].category,
      quantity: productState[i].quantity,
      price: `${productState[i].price} đ`,
      coupons: `${productState[i].coupons !== undefined ? productState[i].coupons : 0} %`,
      warranty: `${productState[i].warranty} tháng`,
      action: (
        <>
          <Link to={`/admin/coupon/${productState[i]._id}`}
            className='fs-3 text-danger'>
            <RiCoupon5Line />
          </Link>
          <Link to={`/admin/product/${productState[i]._id}`}
            className='fs-3 text-danger'>
            <BiEdit />
          </Link>
          <button
            className='ms-3 fs-3 text-danger bg-transparent border-0'
            onClick={() => showModal(productState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }
  const deleteProduct = (e) => {
    dispatch(deleteAProduct(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getProducts());
    }, 100);
  }
  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteProduct(productId)}
        title="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default Productlist;