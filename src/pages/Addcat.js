import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCategory, resetState } from '../features/pcategory/pcategorySlice';

let schema = Yup.object().shape({
  title: Yup.string().required("Category name is Required")
});

const Addcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const newCategory = useSelector((state) => state.pCategory);
  const { isSuccess, isError, isLoading, createdCategory } = newCategory;

  useEffect(() => {
    if (isSuccess && createdCategory) {
      toast.success("Category Added Successfully!")
    }
    else
      if (isError) {
        toast.error("Something went wrong!")
      }
  }, [isSuccess, isError, isLoading,])

  const formik = useFormik({
    initialValues: {
      title: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      dispatch(createCategory(values));
      formik.resetForm();
      setTimeout(() => {
        dispatch(resetState());
      }, 3000)
    },
  });
  return (
    <div>
      <h3 className='mb-4 title'>Add Category</h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Enter Category"
            id="category"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addcat
