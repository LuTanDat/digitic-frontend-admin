import React, { useEffect, useState } from 'react';
import CustomInput from '../components/CustomInput';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropzone from 'react-dropzone'; /////////////////////////////// chon 1 or nhieu anh de upload
import { delImg, uploadImg } from '../features/upload/uploadSlice';
import { toast } from 'react-toastify';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { getCategories } from '../features/bcategory/bcategorySlice';
import { createBlogs, getABlog, resetState, updateABlog } from '../features/blog/blogSlice';

let schema = Yup.object().shape({
  title: Yup.string().required("Title is Required"),
  description: Yup.string().required("Description is Required"),
  category: Yup.string().required("Category is Required"),
});

const Addblog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3];
  useEffect(() => {
    if (getBlogId !== undefined) {
      dispatch(getABlog(getBlogId));
      img.push(blogImages);
    } else {
      dispatch(resetState());
    }
  }, [getBlogId]);

  useEffect(() => {
    dispatch(resetState())
    dispatch(getCategories());
  }, [])

  const imgState = useSelector((state) => state.upload.images);
  const bCatState = useSelector((state) => state.bCategory.bCategories);
  const newBlog = useSelector((state) => state.blog);
  const { isSuccess, isError, isLoading, createdBlog,
    blogName, blogDesc, blogCategory, blogImages, updatedBlog
  } = newBlog;

  useEffect(() => {
    if (isSuccess && createdBlog) {
      toast.success("Blog Added Successfully!")
    }
    if (isSuccess && updatedBlog) {
      toast.success("Blog Updated Successfully!");
      navigate("/admin/blog-list");
    }
    else
      if (isError) {
        toast.error("Something went wrong!")
      }
  }, [isSuccess, isError, isLoading,])

  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    })
  })
  console.log(img)
  useEffect(() => {
    formik.values.images = img;
  }, [blogImages])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blogName || "",
      description: blogDesc || "",
      category: blogCategory || "",
      images: ""
    },
    validationSchema: schema,
    onSubmit: values => {
      if (getBlogId !== undefined) {
        const data = { id: getBlogId, blogData: values };
        dispatch(updateABlog(data));
        dispatch(resetState());
      } else {
        dispatch(createBlogs(values));
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
        {getBlogId !== undefined ? "Edit" : "Add"} Blog</h3>
      <div className=''>
        <form action='' onSubmit={formik.handleSubmit} >
          <div className='mt-3'>
            <CustomInput
              type='text'
              label='Enter Blog Title'
              name='title'
              onChng={formik.handleChange('title')}
              onBlr={formik.handleBlur('title')}
              val={formik.values.title}
            />
            <div className="error">
              {formik.touched.title && formik.errors.title}
            </div>
          </div>
          <select
            name='category'
            onChange={formik.handleChange('category')}
            onBlur={formik.handleBlur('category')}
            value={formik.values.category}
            className='form-control py-3 mt-3'
            id=''
          >
            <option value=''>Select Blog Category</option>
            {
              bCatState.map((i, j) => {
                return (
                  <option key={j} value={i.title}>
                    {i.title}
                  </option>
                )
              })
            }
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <ReactQuill
            theme="snow" className='mt-3'
            name='description'
            onChange={formik.handleChange('description')}
            value={formik.values.description}
          />
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <div className='bg-white border-1 p-5 text-center mt-3'>
            <Dropzone onDrop={acceptedFiles => dispatch(uploadImg(acceptedFiles))}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className='showImages d-flex flex-wrap gap-4'>
            {imgState?.map((i, j) => {
              return (
                <div className='position-relative' key={j}>
                  <button
                    type='button'
                    onClick={() => dispatch(delImg(i.public_id))}
                    className='btn-close position-absolute'
                    style={{ top: "10px", right: "10px" }}
                  >
                  </button>
                  <img src={i.url} alt='' width={200} height={200} />
                </div>
              )
            })}
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            {getBlogId !== undefined ? "Edit" : "Add"} Blog
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addblog
