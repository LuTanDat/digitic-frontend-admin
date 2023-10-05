import React, { useEffect, useState } from 'react';
import CustomInput from '../components/CustomInput';
import { getBrands } from '../features/brand/brandSlice';
import { getCategories } from '../features/pcategory/pcategorySlice';
import { getColors } from '../features/color/colorSlice';
import Multiselect from "react-widgets/Multiselect";
import "react-widgets/styles.css";
import Dropzone from 'react-dropzone'; // chon 1 or nhieu anh de upload

import ReactQuill from 'react-quill'; // text editor
import 'react-quill/dist/quill.snow.css';

import { useFormik } from 'formik'; // xu ly su kien tren form
import * as Yup from 'yup'; // validate field on form
import { useDispatch, useSelector } from 'react-redux';
import { delImg, uploadImg } from '../features/upload/uploadSlice';
import { createProducts } from '../features/product/productSlice';

// import { InboxOutlined } from '@ant-design/icons'; // upload images + <Dragger />
// import { message, Upload } from 'antd';
// import colorService from './../features/color/colorService';
// const { Dragger } = Upload;
// const props = {
//   name: 'file',
//   multiple: true,
//   action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== 'uploading') {
//       console.log(info.file, info.fileList);
//     }
//     if (status === 'done') {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === 'error') {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
//   onDrop(e) {
//     console.log('Dropped files', e.dataTransfer.files);
//   },
// };

let schema = Yup.object().shape({
  title: Yup.string().required("Title is Required"),
  description: Yup.string().required("Description is Required"),
  price: Yup.number().required("Price is Required"),
  brand: Yup.string().required("Brand is Required"),
  category: Yup.string().required("Category is Required"),
  color: Yup.array().required("Color is Required"),
  quantity: Yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());

  }, [])


  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images);

  const colors = [];
  colorState.forEach((i) => {
    colors.push({
      _id: i.id,
      color: i.title,
    })
  })
  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    })
  })

  useEffect(() => {
    formik.values.color = color; // set value in formik = gia tri nao do
    formik.values.images = img;
  }, [color, img])

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      brand: '',
      category: '',
      color: "",
      quantity: '',
      images: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      dispatch(createProducts(values));
      // alert(JSON.stringify(values, null, 2));
    },
  });

  const [desc, setDesc] = useState();
  const handleDesc = (value) => {
    setDesc(value);
  };
  return (
    <div>
      <h3 className='mb-4 title'>Add Product</h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit} className='d-flex flex-column gap-3'>
          <CustomInput
            type='text'
            label='Enter Product Title'
            name='title'
            onChng={formik.handleChange('title')}
            onBlr={formik.handleBlur('title')}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className=''>
            <ReactQuill
              theme="snow"
              name='description'
              onChange={formik.handleChange('description')}
              value={formik.values.description}
            />
            <div className="error">
              {formik.touched.description && formik.errors.description}
            </div>
          </div>
          <CustomInput
            type='number'
            label='Enter Product Price'
            name='price'
            onChng={formik.handleChange('price')}
            onBlr={formik.handleBlur('price')}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>

          <select
            name='brand'
            onChange={formik.handleChange('brand')}
            onBlur={formik.handleBlur('brand')}
            val={formik.values.brand}
            className='form-control py-3 mb-3'
            id=''
          >
            <option value=''>Select Brand</option>
            {
              brandState.map((i, j) => {
                return (
                  <option key={j} value={i.title}>
                    {i.title}
                  </option>
                )
              })
            }
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <select
            name='category'
            onChange={formik.handleChange('category')}
            onBlur={formik.handleBlur('category')}
            val={formik.values.category}
            className='form-control py-3 mb-3'
            id=''
          >
            <option value=''>Select Category</option>
            {
              catState.map((i, j) => {
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
          <Multiselect
            name='color'
            dataKey="id"
            textField="color"
            data={colors}
            onChange={(e) => setColor(e)}
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <CustomInput
            type='number'
            label='Enter Product Quantity'
            name='quantity'
            onChng={formik.handleChange('quantity')}
            onBlr={formik.handleBlur('quantity')}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          {/* <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other
              banned files.
            </p>
          </Dragger> */}
          <div className='bg-white border-1 p-5 text-center'>
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
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addproduct
