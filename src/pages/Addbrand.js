import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBrand, getABrand, resetState, updateABrand } from '../features/brand/brandSlice';

let schema = Yup.object().shape({
  title: Yup.string().required("Brand name is Required")
});

const Addbrand = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBrandId = location.pathname.split("/")[3];
  const newBrand = useSelector((state) => state.brand);
  const { isSuccess, isError, isLoading, createdBrand, brandName, updatedBrand } = newBrand;
  useEffect(() => {
    if (getBrandId !== undefined) {
      dispatch(getABrand(getBrandId));
    } else {
      dispatch(resetState());
    }
  }, [getBrandId]);


  useEffect(() => {
    if (isSuccess && createdBrand) {
      toast.success("Thêm thương hiệu thành công!")
    }
    if (isSuccess && updatedBrand) {
      toast.success("Cập nhật thành công thương hiệu!");
      navigate("/admin/list-brand");
    }
    else
      if (isError) {
        toast.error("Có lỗi xảy ra!")
      }
  }, [isSuccess, isError, isLoading,])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: brandName || "",
    },
    validationSchema: schema,
    onSubmit: values => {
      if (getBrandId !== undefined) {
        const data = { id: getBrandId, brandData: values };
        dispatch(updateABrand(data));
        dispatch(resetState());
      } else {
        dispatch(createBrand(values));
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
        {getBrandId !== undefined ? "Sửa" : "Thêm"} Thương hiệu
      </h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Nhập tên thương hiệu"
            id="brand"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            {getBrandId !== undefined ? "Sửa" : "Thêm"} Thương hiệu
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addbrand
