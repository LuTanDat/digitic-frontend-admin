import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik'; // xu ly su kien tren form
import * as Yup from 'yup'; // validate field on form
import { useDispatch, useSelector } from "react-redux"; // push actions to Redux Store, get State from Redux Store
import { login } from '../features/auth/authSlice';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";


let schema = Yup.object().shape({
  email: Yup.string()
    .email("Email không khả dụng")
    .required("Email không được để trống"),
  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ký tự hoa, ký tự thường, số và ký tự đặc biệt"
    ),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: values => {
      dispatch(login(values))
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
    <div className="py-5" style={{ background: "#7985c9", minHeight: "100vh" }}>
      <div className="auth-card my-5 bg-white mx-auto p-4">
        <h3 className="text-center title">Đăng nhập</h3>
        <div className="error text-center">
          {message.message === 'Rejected' ? 'BẠN KHÔNG PHẢI ADMIN' : ''}
        </div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="email"
            name='email'
            label="Nhập email"
            id="email"
            val={formik.values.email}
            onChng={formik.handleChange("email")}
          />
          <div className="error">
            {formik.touched.email && formik.errors.email ? (
              <div>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className='custom-input-password'>
            <CustomInput
              type={isShowPassword ? "text" : "password"}
              name='password'
              label="Nhập mật khẩu"
              id="pass"
              val={formik.values.password}
              onChng={formik.handleChange("password")}
            />
            <div className="error">
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
            </div>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {
                isShowPassword
                  ? <FaRegEye />
                  : <FaRegEyeSlash />
              }
            </span>
          </div>

          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5 mt-3"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
