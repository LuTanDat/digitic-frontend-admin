import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createColor, resetState } from '../features/color/colorSlice';

let schema = Yup.object().shape({
  title: Yup.string().required("Color name is Required")
});

const Addcolor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const newColor = useSelector((state) => state.color);
  const { isSuccess, isError, isLoading, createdColor } = newColor;

  useEffect(() => {
    if (isSuccess && createdColor) {
      toast.success("Color Added Successfully!")
    }
    else
      if (isError) {
        toast.error("Something went wrong!")
      }
  }, [isSuccess, isError, isLoading, createdColor])

  const formik = useFormik({
    initialValues: {
      title: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      dispatch(createColor(values));
      formik.resetForm();
      setTimeout(() => {
        dispatch(resetState());
      }, 3000)
    },
  });
  return (
    <div>
      <h3 className='mb-4 title'>Add Color</h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <CustomInput
            type="color"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Enter Color"
            id="color"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            Add Color
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addcolor
