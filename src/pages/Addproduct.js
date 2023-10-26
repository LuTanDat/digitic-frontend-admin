import React, { useEffect, useState } from 'react';
import CustomInput from '../components/CustomInput';
import ReactQuill from 'react-quill'; //////////////////////////////// text editor
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getBrands } from '../features/brand/brandSlice';
import { getCategories } from '../features/pcategory/pcategorySlice';
import { getColors } from '../features/color/colorSlice';
import { Select } from 'antd';
import Dropzone from 'react-dropzone'; /////////////////////////////// chon 1 or nhieu anh de upload
import { delImg, uploadImg } from '../features/upload/uploadSlice';
import { createProducts, getAProduct, resetState } from '../features/product/productSlice';
import { useLocation, useNavigate } from 'react-router-dom';

let schema = Yup.object().shape({
  title: Yup.string().required("Tên không được để trống"),
  description: Yup.string().required("Mô tả không được để trống"),
  price: Yup.number().required("Giá không được để trống"),
  brand: Yup.string().required("Thương hiệu không được để trống"),
  category: Yup.string().required("Danh mục không được để trống"),
  tags: Yup.string().required("Tag không được để trống"),
  color: Yup.string().required("Màu không được để trống"),
  quantity: Yup.number().required("Số lượng không được để trống"),
  size: Yup.string().required("Kích thước không được để trống"),
  weight: Yup.string().required("Trọng lượng không được để trống"),
  // power: Yup.string().required("Công suất không được để trống"),
  lifespan: Yup.string().required("Tổi thọ không được để trống"),
  warranty: Yup.string().required("Bảo hành không được để trống"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(getAProduct(getProductId));
    } else {
      dispatch(resetState());
    }
  }, [getProductId]);


  useEffect(() => {
    dispatch(resetState())
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, [])

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, createdProduct,
    productName, productDesc, productPrice, productBrand, productCategory, productTags, productColor, productQuantity, productImages, updatedProduct
  } = newProduct;

  // const selectedColor = productColor?.map(color => color._id);

  // const [color, setColor] = useState(selectedColor);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!")
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfully!");
      navigate("/admin/list-product");
    }
    else
      if (isError) {
        toast.error("Something went wrong!")
      }
  }, [isSuccess, isError, isLoading,])

  // const coloropt = [];
  // colorState.forEach((i) => {
  //   coloropt.push({
  //     label: i.title,
  //     value: i._id,
  //   })
  // })
  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    })
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: productName || '',
      description: productDesc || '',
      price: productPrice || '',
      brand: productBrand || '',
      category: productCategory || '',
      tags: productTags || '',
      color: '',
      quantity: productQuantity || '',
      size: '',
      weight: '',
      power: '',
      lifespan: '',
      warranty: '',
      images: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      alert(JSON.stringify(values));
      // dispatch(createProducts(values));
      // formik.resetForm();
      // // setColor(null);
      // setTimeout(() => {
      //   dispatch(resetState());
      // }, 3000)
    },
  });

  // useEffect(() => {
  //   formik.values.color = color ? color : ""; // set value in formik = gia tri nao do
  //   formik.values.images = img;
  // }, [formik, color, img])

  // const handleColors = (e) => {
  //   setColor(e);
  // }
  return (
    <div>
      <h3 className='mb-2 title'>Thêm sản phẩm</h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit} className='d-flex flex-column gap-3'>
          <CustomInput
            type='text'
            label='Tên sản phẩm'
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
            label='Giá'
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
            value={formik.values.brand}
            className='form-control py-3'
            id=''
          >
            <option value=''>Chọn Thương hiệu</option>
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
            value={formik.values.category}
            className='form-control py-3'
            id=''
          >
            <option value=''>Chọn Danh mục</option>
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
          <select
            name='tags'
            onChange={formik.handleChange('tags')}
            onBlur={formik.handleBlur('tags')}
            value={formik.values.tags}
            className='form-control py-3'
            id=''
          >
            <option value=''>Chọn Tags</option>
            <option value='featured'>Nổi bật</option>
            <option value='popular'>Phổ biến</option>
            <option value='special'>Đặc biệt</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>
          <select
            name='color'
            onChange={formik.handleChange('color')}
            onBlur={formik.handleBlur('color')}
            value={formik.values.color}
            className='form-control py-3'
            id=''
          >
            <option value=''>Chọn Màu</option>
            {
              colorState.map((i, j) => {
                return (
                  <option key={j} value={i.title}>
                    {i.title}
                  </option>
                )
              })
            }
          </select>
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <CustomInput
            type='number'
            label='Số lượng'
            name='quantity'
            onChng={formik.handleChange('quantity')}
            onBlr={formik.handleBlur('quantity')}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          <CustomInput
            type='text'
            label='Kích thước'
            name='size'
            onChng={formik.handleChange('size')}
            onBlr={formik.handleBlur('size')}
            val={formik.values.size}
          />
          <div className="error">
            {formik.touched.size && formik.errors.size}
          </div>
          <CustomInput
            type='text'
            label='Trọng lượng'
            name='weight'
            onChng={formik.handleChange('weight')}
            onBlr={formik.handleBlur('weight')}
            val={formik.values.weight}
          />
          <div className="error">
            {formik.touched.weight && formik.errors.weight}
          </div>
          <CustomInput
            type='text'
            label='Công suất'
            name='power'
            onChng={formik.handleChange('power')}
            onBlr={formik.handleBlur('power')}
            val={formik.values.power}
          />
          <div className="error">
            {formik.touched.power && formik.errors.power}
          </div>
          <CustomInput
            type='text'
            label='Tuổi thọ'
            name='lifespan'
            onChng={formik.handleChange('lifespan')}
            onBlr={formik.handleBlur('lifespan')}
            val={formik.values.lifespan}
          />
          <div className="error">
            {formik.touched.lifespan && formik.errors.lifespan}
          </div>
          <CustomInput
            type='text'
            label='Bảo hành'
            name='warranty'
            onChng={formik.handleChange('warranty')}
            onBlr={formik.handleBlur('warranty')}
            val={formik.values.warranty}
          />
          <div className="error">
            {formik.touched.warranty && formik.errors.warranty}
          </div>
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
            Thêm Sản phẩm
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addproduct
