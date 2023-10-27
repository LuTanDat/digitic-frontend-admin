/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { RiCoupon5Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAProduct, getProducts, resetState } from '../features/product/productSlice';
import CustomModal from '../components/CustomModal';
import { getAllCoupons } from "../features/coupon/couponSlice";

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
    dispatch(getAllCoupons());

  }, []);
  const productState = useSelector((state) => state.product?.products);
  const couponState = useSelector((state) => state.coupon?.coupons);
  const data1 = [];

  for (let i = 0; i < productState.length; i++) {
    let price = productState[i].price;
    let discountPercent = 0;
    for (let j = 0; j < couponState.length; j++) {
      if (productState[i]._id === couponState[j].product?._id) {
        discountPercent = couponState[j].discount;
        price *= (100 - discountPercent) / 100;
        break;
      }
    }

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

    data1.push({
      key: i + 1,
      image: (
        <div className='product-image'>
          <img
            src={productState[i]?.images[0]?.url}
            className='img-fluid mx-auto'
            alt='product image'
            width={160}
          />
        </div>
      ),
      title: productState[i].title,
      brand: productState[i].brand,
      category: productState[i].category,
      quantity: productState[i].quantity,
      price: formattedPrice,
      coupons: `${discountPercent} %`,
      warranty: `${productState[i].warranty}`,
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
      <h3 className="mb-4 title">Sản phẩm</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteProduct(productId)}
        title="Bạn chắc chắn muốn xóa sản phẩm này?"
      />
    </div>
  );
};

export default Productlist;