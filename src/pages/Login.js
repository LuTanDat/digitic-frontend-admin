import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";

import { useFormik } from 'formik'; // xu ly su kien tren form
import * as Yup from 'yup'; // validate field on form

import { useDispatch, useSelector } from "react-redux"; // push actions to Redux Store, get State from Redux Store
import { login } from '../features/auth/authSlice';

let schema = Yup.object().shape({
  email: Yup.string()
    .email("Email should be valid")
    .required("Email is Required"),
  password: Yup.string().required("Password is Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: values => {
      dispatch(login(values))
      // alert(JSON.stringify(values, null, 2));
    },
  });

  const authState = useSelector((state) => state);// lay full state cua Redux

  const { user, isLoading, isSuccess, isError, message } = authState.auth;// cham name state muon lay

  useEffect(() => {
    if (!user == null || isSuccess) {
      navigate("admin");
    }
    else {
      navigate("");
    }
  }, [user, isLoading, isSuccess, isError, message])
  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Login</h3>
        <p className="text-center">Login to your account to continue.</p>
        <div className="error text-center">
          {message.message === 'Rejected' ? 'You are not an Admin' : ''}
        </div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name='email'
            label="Email Address"
            id="email"
            val={formik.values.email}
            onChng={formik.handleChange("email")}
          />
          <div className="error">
            {formik.touched.email && formik.errors.email ? (
              <div>{formik.errors.email}</div>
            ) : null}
          </div>
          <CustomInput
            type="password"
            name='password'
            label="Password"
            id="pass"
            val={formik.values.password}
            onChng={formik.handleChange("password")}
          />
          <div className="error">
            {formik.touched.password && formik.errors.password ? (
              <div>{formik.errors.password}</div>
            ) : null}
          </div>
          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5 mt-3"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
