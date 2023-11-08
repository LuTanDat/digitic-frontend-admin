/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
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
import { delImg, resetStateUpload, uploadImg } from '../features/upload/uploadSlice';
import { createProducts, getAProduct, resetState, updateAProduct } from '../features/product/productSlice';
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
  power: Yup.string(),
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
    dispatch(resetStateUpload())
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, [])

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, createdProduct, updatedProduct,
    productName, productDesc, productPrice, productBrand, productCategory,
    productTags, productColor, productQuantity, productSize, productWeight,
    productPower, productLifespan, productWarranty
  } = newProduct;
  const { productImages } = newProduct; // mang anh minh load trong db ra neu có getProductId, ko co thi []
  const imgState = useSelector((state) => state.upload.images); //mang anh minh up len, ko co thi []

  const deletedImageState = useSelector((state) => state.upload.deletedImage); // anh da xoa tren dam may

  console.log("deletedImageState", deletedImageState?.deletedImageId);

  useEffect(() => {
    if (isSuccess && createdProduct) {
      setTotalImagesSaveDB([]);
      toast.success("Thêm thành công sản phẩm!")
    }
    if (isSuccess && updatedProduct) {
      toast.success("Cập nhật thành công sản phẩm!");
      navigate("/admin/list-product");
    }
    else
      if (isError) {
        toast.error("Something went wrong!")
      }
  }, [isSuccess, isError, isLoading,])


  // XU LY ADD ANH
  const [totalImagesSaveDB, setTotalImagesSaveDB] = useState([]); // Tong hinh de luu vao db

  const [imagesUploaded, setImagesUploaded] = useState([]);
  useEffect(() => {
    const img = []; // Sau khi da xu ly anh minh up len:
    imgState.forEach((i) => {
      img.push({
        public_id: i.public_id,
        url: i.url,
      })
    })
    setImagesUploaded(img);
    setTotalImagesSaveDB([...totalImagesSaveDB, ...img])
  }, [imgState])

  const [imagesProducted, setImagesProducted] = useState([]);
  useEffect(() => {
    const img = []; // Sau khi da xu ly hinh load trong DB ra khi co getProductId
    productImages.forEach((i) => {
      img.push({
        public_id: i.public_id,
        url: i.url,
      })
    })
    setImagesProducted(img);
    setTotalImagesSaveDB([...totalImagesSaveDB, ...img])
  }, [productImages])

  console.log("Mang hinh load trong DB ra khi co getProductId: ", productImages);
  console.log("Sau khi da xu ly hinh load trong DB ra khi co getProductId: ", imagesProducted);
  console.log("Mang hinh minh up len: ", imgState);
  console.log("Sau khi da xu ly anh minh up len: ", imagesUploaded);
  console.log("Tong hinh de luu vao db: ", totalImagesSaveDB);


  // XU LY DELETE ANH 
  useEffect(() => {
    const imagesArr = totalImagesSaveDB.filter(item => item?.public_id !== deletedImageState?.deletedImageId);
    setTotalImagesSaveDB(imagesArr); // Mang hinh sau khi xoa:
  }, [deletedImageState?.deletedImageId])


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: productName || '',
      description: productDesc || '',
      price: productPrice || '',
      brand: productBrand || '',
      category: productCategory || '',
      tags: productTags || '',
      color: productColor || '',
      quantity: productQuantity || '',
      size: productSize || '',
      weight: productWeight || '',
      power: productPower || '',
      lifespan: productLifespan || '',
      warranty: productWarranty || '',
      images: ""
    },
    validationSchema: schema,
    onSubmit: values => {
      values.images = totalImagesSaveDB;
      if (getProductId !== undefined) {
        const data = { id: getProductId, productData: values };
        dispatch(updateAProduct(data));
      } else {
        dispatch(createProducts(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          dispatch(resetStateUpload());
          dispatch(getBrands());
          dispatch(getCategories());
          dispatch(getColors());
        }, 2000);
      }
    },
  });

  return (
    <div>
      <h3 className='mb-2 title'>
        {getProductId !== undefined ? "Sửa" : "Thêm"} Sản phẩm</h3>
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
                    {i.title === "#ffffff" ? "Trắng" : i.title === "#000000" ? "Đen" : i.title}
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
            label='Kích thước (Cm)'
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
            label='Trọng lượng (Kg)'
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
            label='Công suất (W)'
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
            label='Tuổi thọ (H)'
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
            label='Bảo hành (Tháng)'
            name='warranty'
            onChng={formik.handleChange('warranty')}
            onBlr={formik.handleBlur('warranty')}
            val={formik.values.warranty}
          />
          <div className="error">
            {formik.touched.warranty && formik.errors.warranty}
          </div>
          <div className='bg-white border-1 p-1 text-center'>
            <Dropzone onDrop={acceptedFiles => dispatch(uploadImg(acceptedFiles))}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className='mb-0 p-4'>Chọn 1 hoặc nhiều ảnh muốn tải lên</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className='showImages d-flex flex-wrap gap-4'>
            {totalImagesSaveDB?.length !== 0 && totalImagesSaveDB?.map((i, j) => {
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
            {/* {imgState?.length === 0 && productImages?.length !== 0 && productImages?.map((i, j) => {
              return (
                <div className='position-relative' key={j}>
                  <button
                    type='button'
                    onClick={() => handleDeleteImage (i.public_id)}
                    className='btn-close position-absolute'
                    style={{ top: "10px", right: "10px" }}
                  >
                  </button>
                  <img src={i.url} alt='' width={200} height={200} />
                </div>
              )
            })} */}
          </div>

          <button
            className='btn btn-success border-0 rounded-3 my-3'
            type="submit"
          >
            {getProductId !== undefined ? "Sửa" : "Thêm"} Sản phẩm
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addproduct