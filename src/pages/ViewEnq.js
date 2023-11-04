import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { getAEnquiry, resetState, updateAEnquiry } from '../features/enquiry/enquirySlice';
import { BiArrowBack } from 'react-icons/bi';

const ViewEnq = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getEnqId = location.pathname.split("/")[3];
  const enqState = useSelector((state) => state.enquiry);
  const { enqName, enqMobile, enqEmail, enqComment, enqStatus } = enqState;
  useEffect(() => {
    dispatch(getAEnquiry(getEnqId));
  }, [getEnqId])

  const goBack = () => {
    navigate(-1);
  }

  const setEnquiryStatus = (e, i) => {
    const data = { id: i, enqData: e };
    dispatch(updateAEnquiry(data));
    dispatch(resetState());
    setTimeout(() => {
      dispatch(getAEnquiry(getEnqId));
    }, 100);
  };
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h3 className='mb-4 title'>Xem chi tiết Góp ý</h3>
        <button className='bg-transparent border-0 fs-6 mb-0 d-flex align-items-center gap-1' onClick={goBack}>
          <BiArrowBack className='fs-5' /> Trở lại
        </button>
      </div>
      <div className='mt-5 bg-white p-4 rounded-3 d-flex flex-column gap-3'>
        <div className='d-flex align-items-center gap-3'>
          <h6 className='mb-0'>Tên: </h6>
          <p className='mb-0'>{enqName}</p>
        </div>
        <div className='d-flex align-items-center gap-3'>
          <h6 className='mb-0'>Số điện thoại: </h6>
          <p className='mb-0'>
            <a href={`tel:+84${enqMobile}`}>{enqMobile}</a>
          </p>
        </div>
        <div className='d-flex align-items-center gap-3'>
          <h6 className='mb-0'>Email: </h6>
          <p className='mb-0'>
            <a href={`mailto:{enqEmail}`}>{enqEmail}</a>
          </p>
        </div>
        <div className='d-flex align-items-center gap-3'>
          <h6 className='mb-0'>Nội dung: </h6>
          <p className='mb-0'>{enqComment}</p>
        </div>
        <div className='d-flex align-items-center gap-3'>
          <h6 className='mb-0'>Trạng thái: </h6>
          <p className='mb-0'>{enqStatus}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Thay đổi trạng thái:</h6>
          <div>
            <select
              name=""
              defaultValue={enqStatus ? enqStatus : "Đã gửi"}
              className="form-control form-select"
              id=""
              onChange={(e) => setEnquiryStatus(e.target.value, getEnqId)}
            >
              <option value="Đã gửi">Đã gửi</option>
              <option value="Đang xem xét">Đang xem xét</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã xử lý">Đã xử lý</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewEnq
