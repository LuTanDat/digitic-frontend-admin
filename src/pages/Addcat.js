import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCategory, getAProductCategory, resetState, updateAProductCategory } from '../features/pcategory/pcategorySlice';

let schema = Yup.object().shape({
  title: Yup.string().required("Category name is Required")
});

const Addcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];
  const newCategory = useSelector((state) => state.pCategory);
  const { isSuccess, isError, isLoading, createdCategory, categoryName, updatedCategory } = newCategory;
  useEffect(() => {
    if (getPCatId !== undefined) {
      dispatch(getAProductCategory(getPCatId));
    } else {
      dispatch(resetState());
    }
  }, [getPCatId]);


  useEffect(() => {
    if (isSuccess && createdCategory) {
      toast.success("Thêm danh mục thành công!")
    }
    if (isSuccess && updatedCategory) {
      toast.success("Cập nhật thành công danh mục!");
      navigate("/admin/list-category");
    }
    else
      if (isError) {
        toast.error("Có lỗi xảy ra!")
      }
  }, [isSuccess, isError, isLoading,])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: categoryName || "",
    },
    validationSchema: schema,
    onSubmit: values => {
      if (getPCatId !== undefined) {
        const data = { id: getPCatId, pCatData: values };
        dispatch(updateAProductCategory(data));
        dispatch(resetState());
      } else {
        dispatch(createCategory(values));
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
        {getPCatId !== undefined ? "Sửa" : "Thêm"} Danh mục
      </h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Nhập tên danh mục"
            id="category"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            {getPCatId !== undefined ? "Sửa" : "Thêm"} Danh mục
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addcat
