import React, { useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSupplier, getASupplier, resetState, updateASupplier } from '../features/supplier/supplierSlice';

let schema = Yup.object().shape({
  name: Yup.string().required("Supplier name is Required"),
  email: Yup.string()
    .email("Email should be valid")
    .required("Email is Required"),
  mobile: Yup.string().required("Supplier mobile is Required"),
  address: Yup.string().required("Supplier address is Required")
});

const Addsupplier = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getSupplierId = location.pathname.split("/")[3];
  const newSupplier = useSelector((state) => state.supplier);
  const { isSuccess, isError, isLoading, createdSupplier, supplierName, supplierEmail, supplierMobile, supplierAddress, updatedSupplier } = newSupplier;
  useEffect(() => {
    if (getSupplierId !== undefined) {
      dispatch(getASupplier(getSupplierId));
    } else {
      dispatch(resetState());
    }
  }, [getSupplierId]);


  useEffect(() => {
    if (isSuccess && createdSupplier) {
      toast.success("Supplier Added Successfully!")
    }
    if (isSuccess && updatedSupplier) {
      toast.success("Supplier Updated Successfully!");
      navigate("/admin/list-supplier");
    }
    else
      if (isError) {
        toast.error("Something went wrong!")
      }
  }, [isSuccess, isError, isLoading,])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: supplierName || "",
      email: supplierEmail || "",
      mobile: supplierMobile || "",
      address: supplierAddress || "",
    },
    validationSchema: schema,
    onSubmit: values => {
      if (getSupplierId !== undefined) {
        const data = { id: getSupplierId, supplierData: values };
        dispatch(updateASupplier(data));
      } else {
        dispatch(createSupplier(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 500);
      }
    },
  });
  return (
    <div>
      <h3 className='mb-4 title'>
        {getSupplierId !== undefined ? "Edit" : "Add"} Supplier
      </h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="name"
            onChng={formik.handleChange("name")}
            onBlr={formik.handleBlur("name")}
            val={formik.values.name}
            label="Enter Name"
            id="supplier"
          />
          <div className="error">
            {formik.touched.name && formik.errors.name}
          </div>
          <CustomInput
            type="text"
            name="email"
            onChng={formik.handleChange("email")}
            onBlr={formik.handleBlur("email")}
            val={formik.values.email}
            label="Enter Email"
            id="supplier"
          />
          <div className="error">
            {formik.touched.email && formik.errors.email}
          </div>
          <CustomInput
            type="text"
            name="mobile"
            onChng={formik.handleChange("mobile")}
            onBlr={formik.handleBlur("mobile")}
            val={formik.values.mobile}
            label="Enter Mobile"
            id="supplier"
          />
          <div className="error">
            {formik.touched.mobile && formik.errors.mobile}
          </div>
          <CustomInput
            type="text"
            name="address"
            onChng={formik.handleChange("address")}
            onBlr={formik.handleBlur("address")}
            val={formik.values.address}
            label="Enter Address"
            id="supplier"
          />
          <div className="error">
            {formik.touched.address && formik.errors.address}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            {getSupplierId !== undefined ? "Edit" : "Add"} Supplier
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addsupplier
