/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import CustomInput from '../components/CustomInput';
import { useFormik } from 'formik'; ////////////////////////////////// xu ly su kien tren form
import * as Yup from 'yup'; ////////////////////////////////////////// validate field on form
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCategory, getAProductCategory, resetState, updateAProductCategory } from '../features/pcategory/pcategorySlice';
import { delImg, resetStateUpload, uploadImg } from '../features/upload/uploadSlice';
import Dropzone from 'react-dropzone';

let schema = Yup.object().shape({
  title: Yup.string().required("Category name is Required"),
});

const Addcat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];

  useEffect(() => {
    if (getPCatId !== undefined) {
      dispatch(resetState());
      dispatch(resetStateUpload());
      dispatch(getAProductCategory(getPCatId));
    } else {
      dispatch(resetState());
      dispatch(resetStateUpload());
    }
  }, [getPCatId]);

  const newCategory = useSelector((state) => state.pCategory);
  const { isSuccess, isError, isLoading, createdCategory, categoryName, updatedCategory } = newCategory;
  const { productImages } = newCategory; // mang anh minh load trong db ra neu có getPCatId, ko co thi []
  const imgState = useSelector((state) => state.upload.images); //mang anh minh up len, ko co thi []

  const deletedImageState = useSelector((state) => state.upload.deletedImage); // anh da xoa tren dam may

  console.log("deletedImageState", deletedImageState?.deletedImageId);

  useEffect(() => {
    if (isSuccess && createdCategory) {
      setTotalImagesSaveDB([]);
      toast.success("Thêm danh mục thành công!")
    }
    if (isSuccess && updatedCategory) {
      toast.success("Cập nhật thành công danh mục!");
      navigate("/admin/list-category");
    }
    else
      if (isError) {
        toast.error("Có lỗi xảy ra!")
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
    const img = []; // Sau khi da xu ly hinh load trong DB ra khi co getPCatId
    productImages.forEach((i) => {
      img.push({
        public_id: i.public_id,
        url: i.url,
      })
    })
    setImagesProducted(img);
    setTotalImagesSaveDB([...totalImagesSaveDB, ...img])
  }, [productImages])

  console.log("Mang hinh load trong DB ra khi co getPCatId: ", productImages);
  console.log("Sau khi da xu ly hinh load trong DB ra khi co getPCatId: ", imagesProducted);
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
      title: categoryName || "",
      images: ""
    },
    validationSchema: schema,
    onSubmit: values => {
      values.images = totalImagesSaveDB;
      if (getPCatId !== undefined) {
        const data = { id: getPCatId, pCatData: values };
        dispatch(updateAProductCategory(data));
      } else {
        dispatch(createCategory(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          dispatch(resetStateUpload());
        }, 500);
      }
    },
  });
  return (
    <div>
      <h3 className='mb-4 title'>
        {getPCatId !== undefined ? "Sửa" : "Thêm"} Danh mục
      </h3>
      <div>
        <form action='' onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Nhập tên danh mục"
            id="category"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className='bg-white border-1 p-1 text-center mt-3'>
            <Dropzone onDrop={acceptedFiles => dispatch(uploadImg(acceptedFiles))}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className='mb-0 p-4'>Chọn 1 hoặc nhiều ảnh muốn tải lên (sẽ tốn một ít thời gian)</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className='showImages d-flex flex-wrap gap-4 mt-3'>
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
          </div>
          <button
            className='btn btn-success border-0 rounded-3 my-5'
            type='submit'
          >
            {getPCatId !== undefined ? "Sửa" : "Thêm"} Danh mục
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addcat
