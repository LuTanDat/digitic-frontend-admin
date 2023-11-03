import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createColor, getAColor, resetState, updateAColor } from '../features/color/colorSlice';

let schema = Yup.object().shape({
  title: Yup.string().required("Color name is Required")
});

const Addcolor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getColorId = location.pathname.split("/")[3];
  const newColor = useSelector((state) => state.color);
  const { isSuccess, isError, isLoading, createdColor, colorName, updatedColor } = newColor;
  useEffect(() => {
    if (getColorId !== undefined) {
      dispatch(getAColor(getColorId));
    } else {
      dispatch(resetState());
    }
  }, [getColorId]);

  useEffect(() => {
    if (isSuccess && createdColor) {
      toast.success("Thêm màu thành công!")
    }
    if (isSuccess && updatedColor) {
      toast.success("Cập nhật thành công màu!");
      navigate("/admin/list-color");
    }
    else
      if (isError) {
        toast.error("Có lỗi xảy ra!")
      }
  }, [isSuccess, isError, isLoading, createdColor])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: colorName || "",
    },
    validationSchema: schema,
    onSubmit: values => {
      if (getColorId !== undefined) {
        const data = { id: getColorId, colorData: values };
        dispatch(updateAColor(data));
        dispatch(resetState());
      } else {
        dispatch(createColor(values));
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
        {getColorId !== undefined ? "Sửa" : "Thêm"} Màu
      </h3>
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
            {getColorId !== undefined ? "Sửa" : "Thêm"} Màu
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addcolor
