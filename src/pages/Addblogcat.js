import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBlogCategory, getABlogCat, resetState, updateABlogCat } from '../features/bcategory/bcategorySlice';

let schema = Yup.object().shape({
  title: Yup.string().required("Tên không được để trống")
});

const Addblogcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBCatId = location.pathname.split("/")[3];
  const newBlogCategory = useSelector((state) => state.bCategory);
  const { isSuccess, isError, isLoading, createdBlogCategory, blogCatName, updatedBlogCategory } = newBlogCategory;
  useEffect(() => {
    if (getBCatId !== undefined) {
      dispatch(getABlogCat(getBCatId));
    } else {
      dispatch(resetState());
    }
  }, [getBCatId]);


  useEffect(() => {
    if (isSuccess && createdBlogCategory) {
      toast.success("Thêm Danh mục Bài viết thành công!")
    }
    if (isSuccess && updatedBlogCategory) {
      toast.success("Cập nhật thành công Danh mục Bài viết!");
      navigate("/admin/blog-category-list");
    }
    else
      if (isError) {
        toast.error("Có lỗi xảy ra!")
      }
  }, [isSuccess, isError, isLoading,])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blogCatName || "",

    },
    validationSchema: schema,
    onSubmit: values => {
      if (getBCatId !== undefined) {
        const data = { id: getBCatId, blogCatData: values };
        dispatch(updateABlogCat(data));
        dispatch(resetState());
      } else {
        dispatch(createBlogCategory(values));
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
        {getBCatId !== undefined ? "Sửa" : "Thêm"} Danh mục Bài viết
      </h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Nhập tên Danh mục Bài viết"
            id="blogcat"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            {getBCatId !== undefined ? "Sửa" : "Thêm"} Danh mục Bài viết
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addblogcat
