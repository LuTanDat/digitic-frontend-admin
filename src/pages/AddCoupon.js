import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createCoupon, getACoupon, resetState, updateACoupon } from '../features/coupon/couponSlice';
import { json, useLocation, useNavigate } from 'react-router-dom';
import { getAProduct } from './../features/product/productSlice';

let schema = Yup.object().shape({
  start: Yup.date().required("Ngày bắt đầu không được trống"),
  expiry: Yup.date().required("Ngày kết thúc không được trống"),
  discount: Yup.number().required("Phần trăm giảm không để trống"),
});

const AddCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];
  const newCoupon = useSelector((state) => state.coupon);
  const { isSuccess, isError, isLoading, createdCoupon, productName, couponDiscount, couponStart, couponExpiry, updatedCoupon } = newCoupon;
  const productName1 = useSelector((state) => state.product.productName);
  // CONVERT DAY
  const changeDateFormet = (date) => {
    const newDate = new Date(date).toLocaleDateString(); // convert to  format beatiful day
    const [month, day, year] = newDate.split('/');
    return [year, month, day].join('-');
  }

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(resetState());
      dispatch(getACoupon(getProductId));
      if (productName === undefined) {
        dispatch(getAProduct(getProductId));
      }
    }
  }, [getProductId]);

  useEffect(() => {
    if (isSuccess && createdCoupon) {
      toast.success("Coupon Added Successfully!")
      navigate("/admin/list-product")
    }
    if (isSuccess && updatedCoupon) {
      toast.success("Coupon Updated Successfully!");
      navigate("/admin/coupon-list");
    }
    else
      if (isError && productName && couponDiscount && couponExpiry) {
        toast.error("Something went wrong!")
      }
  }, [isSuccess, isError, isLoading,])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: productName || productName1 || "",
      product: getProductId || "",
      discount: couponDiscount || "",
      start: changeDateFormet(couponStart) || "",
      expiry: changeDateFormet(couponExpiry) || "",

    },
    validationSchema: schema,
    onSubmit: values => {
      delete values.name;
      if (productName !== undefined) {
        const data = { id: getProductId, couponData: values };
        dispatch(updateACoupon(data));
      }
      else if (productName === undefined) {
        dispatch(createCoupon(values));
        formik.resetForm();
      }
    },
  });
  return (
    <div>
      <h3 className='mb-4 title'>
        {getProductId !== undefined ? "Sửa" : "Thêm"} Mã giảm giá
      </h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="name"
            onChng={formik.handleChange("name")}
            onBlr={formik.handleBlur("name")}
            val={formik.values.name}
            label="Tên Sản phẩm"
            id="name"
            disabled
          />
          <CustomInput
            type="number"
            name="discount"
            onChng={formik.handleChange("discount")}
            onBlr={formik.handleBlur("discount")}
            val={formik.values.discount}
            label="Phần trăm khuyến mãi"
            id="discount"
          />
          <div className="error">
            {formik.touched.discount && formik.errors.discount}
          </div>
          <CustomInput
            type="date"
            name="start"
            onChng={formik.handleChange("start")}
            onBlr={formik.handleBlur("start")}
            val={formik.values.start}
            label="Nhập ngày bắt đầu"
            id="date"
          />
          <div className="error">
            {formik.touched.start && formik.errors.start}
          </div>
          <CustomInput
            type="date"
            name="expiry"
            onChng={formik.handleChange("expiry")}
            onBlr={formik.handleBlur("expiry")}
            val={formik.values.expiry}
            label="Nhập ngày kết thúc"
            id="date"
          />
          <div className="error">
            {formik.touched.expiry && formik.errors.expiry}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            {getProductId !== undefined ? "Sửa" : "Thêm"} Mã giảm giá
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddCoupon
