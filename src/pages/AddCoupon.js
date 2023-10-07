import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createCoupon, getACoupon, resetState, updateACoupon } from '../features/coupon/couponSlice';
import { useLocation, useNavigate } from 'react-router-dom';

let schema = Yup.object().shape({
  name: Yup.string().required("Coupon name is Required"),
  expiry: Yup.date().required("Expiry Date is Required"),
  discount: Yup.number().required("Discount Percentage is Required"),
});

const AddCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getCouponId = location.pathname.split("/")[3];
  const newCoupon = useSelector((state) => state.coupon);
  const { isSuccess, isError, isLoading, createdCoupon, couponName, couponDiscount, couponExpiry, updatedCoupon } = newCoupon;

  // CONVERT DAY
  const changeDateFormet = (date) => {
    const newDate = new Date(date).toLocaleDateString(); // convert to  format beatiful day
    const [month, day, year] = newDate.split('/');
    return [year, month, day].join('-');
  }

  useEffect(() => {
    if (getCouponId !== undefined) {
      dispatch(getACoupon(getCouponId));
    } else {
      dispatch(resetState());
    }
  }, [getCouponId]);

  useEffect(() => {
    if (isSuccess && createdCoupon) {
      toast.success("Coupon Added Successfully!")
    }
    if (isSuccess && updatedCoupon) {
      toast.success("Coupon Updated Successfully!");
      navigate("/admin/coupon-list");
    }
    else
      if (isError && couponName && couponDiscount && couponExpiry) {
        toast.error("Something went wrong!")
      }
  }, [isSuccess, isError, isLoading,])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: couponName || "",
      expiry: changeDateFormet(couponExpiry) || "",
      discount: couponDiscount || "",
    },
    validationSchema: schema,
    onSubmit: values => {
      if (getCouponId !== undefined) {
        const data = { id: getCouponId, couponData: values };
        dispatch(updateACoupon(data));
        dispatch(resetState());
      } else {
        dispatch(createCoupon(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });
  return (
    <div>
      <h3 className='mb-4 title'>
        {getCouponId !== undefined ? "Edit" : "Add"} Coupon
      </h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="name"
            onChng={formik.handleChange("name")}
            onBlr={formik.handleBlur("name")}
            val={formik.values.name}
            label="Enter Coupon Name"
            id="name"
          />
          <div className="error">
            {formik.touched.name && formik.errors.name}
          </div>
          <CustomInput
            type="date"
            name="expiry"
            onChng={formik.handleChange("expiry")}
            onBlr={formik.handleBlur("expiry")}
            val={formik.values.expiry}
            label="Enter Expiry Date"
            id="date"
          />
          <div className="error">
            {formik.touched.expiry && formik.errors.expiry}
          </div>
          <CustomInput
            type="number"
            name="discount"
            onChng={formik.handleChange("discount")}
            onBlr={formik.handleBlur("discount")}
            val={formik.values.discount}
            label="Enter Discount"
            id="discount"
          />
          <div className="error">
            {formik.touched.discount && formik.errors.discount}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            {getCouponId !== undefined ? "Edit" : "Add"} Coupon
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddCoupon
