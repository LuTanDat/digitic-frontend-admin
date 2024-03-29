/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete, AiFillPrinter } from 'react-icons/ai';
import { deleteAOrder, getOrders, resetState, updateAOrder } from '../features/auth/authSlice';
import CustomModal from '../components/CustomModal';
import PieChartComponent from '../components/PieChartComponent';

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Tên K.Hàng",
    dataIndex: "name",
  },
  {
    title: "Sản phẩm",
    dataIndex: "product",
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "payment",
  },
  {
    title: "Tổng tiền",
    dataIndex: "amount",
  },
  {
    title: "Ngày đặt hàng",
    dataIndex: "date",
  },
  {
    title: "Trạng thái đơn hàng",
    dataIndex: "status",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
  },
];

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [selectedNavItem, setSelectedNavItem] = useState(null);

  const showModal = (e) => {
    setOpen(true);
    setOrderId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const getTokenFromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const config3 = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
        }`,
      Accept: "application/json",
    },
  };

  const dispatch = useDispatch();

  const orderState = useSelector((state) => state?.auth?.orders?.orders);
  const updatedOrderState = useSelector((state) => state?.auth?.updatedOrder);

  useEffect(() => {
    dispatch(resetState());
    dispatch(getOrders(config3));
  }, [updatedOrderState])


  const data1 = [];
  for (let i = 0; i < orderState?.length; i++) {
    const statusSelect = orderState[i]?.orderStatus === 'Đã đặt hàng' ? (
      <select name='' defaultValue={orderState[i]?.orderStatus} onChange={(e) => updateOrderStatus(orderState[i]?._id, e.target.value)} id='' className='form-control form-select'>
        <option value="Đã đặt hàng" disabled>Đã đặt hàng</option>
        <option value="Đang xử lý">Đang xử lý</option>
        <option value="Đang giao" disabled>Đang giao</option>
        <option value="Đã nhận hàng" disabled>Đã nhận hàng</option>
        <option value="Đã Hủy" disabled>Đã Hủy</option>
      </select>
    ) : orderState[i]?.orderStatus === 'Đang xử lý' ? (
      <select name='' defaultValue={orderState[i]?.orderStatus} onChange={(e) => updateOrderStatus(orderState[i]?._id, e.target.value)} id='' className='form-control form-select'>
        <option value="Đã đặt hàng" disabled>Đã đặt hàng</option>
        <option value="Đang xử lý" disabled>Đang xử lý</option>
        <option value="Đang giao">Đang giao</option>
        <option value="Đã nhận hàng" disabled>Đã nhận hàng</option>
        <option value="Đã Hủy" disabled>Đã Hủy</option>
      </select>
    ) : orderState[i]?.orderStatus === 'Đang giao' ? (
      <select name='' defaultValue={orderState[i]?.orderStatus} onChange={(e) => updateOrderStatus(orderState[i]?._id, e.target.value)} id='' className='form-control form-select'>
        <option value="Đã đặt hàng" disabled>Đã đặt hàng</option>
        <option value="Đang xử lý" disabled>Đang xử lý</option>
        <option value="Đang giao" disabled>Đang giao</option>
        <option value="Đã nhận hàng">Đã nhận hàng</option>
        <option value="Đã Hủy" disabled>Đã Hủy</option>
      </select>
    ) : (
      <select name='' defaultValue={orderState[i]?.orderStatus} onChange={(e) => updateOrderStatus(orderState[i]?._id, e.target.value)} id='' className='form-control form-select' disabled>
        <option value="Đã đặt hàng" disabled>Đã đặt hàng</option>
        <option value="Đang xử lý" disabled>Đang xử lý</option>
        <option value="Đang giao" disabled>Đang giao</option>
        <option value="Đã nhận hàng" disabled>Đã nhận hàng</option>
        <option value="Đã Hủy" disabled>Đã Hủy</option>
      </select>
    );

    if (selectedNavItem !== null && orderState[i]?.orderStatus === selectedNavItem) {
      data1.push({
        key: i + 1,
        name: orderState[i]?.shippingInfo?.lastName + " " + orderState[i]?.shippingInfo?.firstName,
        product: (
          <Link to={`/admin/order/${orderState[i]?._id}`}>
            Xem chi tiết
          </Link>
        ),
        payment: orderState[i]?.paymentMethod,
        amount: (orderState[i]?.totalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        date: new Date(orderState[i]?.createdAt).toLocaleString(),
        // status: (
        //   <>
        //     <select name='' defaultValue={orderState[i]?.orderStatus} onChange={(e) => updateOrderStatus(orderState[i]?._id, e.target.value)} id='' className='form-control form-select'>
        //       <option value="Đã đặt hàng">Đã đặt hàng</option>
        //       <option value="Đang xử lý">Đang xử lý</option>
        //       <option value="Đang giao">Đang giao</option>
        //       <option value="Đã nhận hàng">Đã nhận hàng</option>
        //       <option value="Đã Hủy" disabled>Đã Hủy</option>
        //     </select>
        //   </>
        // ),
        status: statusSelect,
        action: (
          <>
            <button
              className='fs-4 bg-transparent border-0'
              style={{ color: "blue" }}
              onClick={() => printOrder(orderState[i])}
            >
              <AiFillPrinter />
            </button>
            {/* <Link to={`/admin/order/${orderState[i]._id}`}
              className='fs-3 text-danger'>
              <BiEdit />
            </Link> */}
            <button
              className='fs-4 text-danger bg-transparent border-0'
              onClick={() => showModal(orderState[i]._id)}
            >
              <AiFillDelete />
            </button>
          </>
        )
      });
    }
    else
      if (selectedNavItem === null) {
        data1.push({
          key: i + 1,
          name: orderState[i]?.shippingInfo?.lastName + " " + orderState[i]?.shippingInfo?.firstName,
          product: (
            <Link to={`/admin/order/${orderState[i]?._id}`}>
              Xem chi tiết
            </Link>
          ),
          payment: orderState[i]?.paymentMethod,
          amount: (orderState[i]?.totalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
          date: new Date(orderState[i]?.createdAt).toLocaleString(),
          // status: (
          //   <>
          //     <select name='' defaultValue={orderState[i]?.orderStatus} onChange={(e) => updateOrderStatus(orderState[i]?._id, e.target.value)} id='' className='form-control form-select'>
          //       <option value="Đã đặt hàng">Đã đặt hàng</option>
          //       <option value="Đang xử lý">Đang xử lý</option>
          //       <option value="Đang giao">Đang giao</option>
          //       <option value="Đã nhận hàng">Đã nhận hàng</option>
          //       <option value="Đã Hủy" disabled>Đã Hủy</option>
          //     </select>
          //   </>
          // ),
          status: statusSelect,
          action: (
            <>
              <button
                className='fs-4 bg-transparent border-0'
                style={{ color: "blue" }}
                onClick={() => printOrder(orderState[i])}
              >
                <AiFillPrinter />
              </button>
              {/* <Link to={`/admin/order/${orderState[i]._id}`}
            className='fs-3 text-danger'>
            <BiEdit />
          </Link> */}
              <button
                className='fs-4 text-danger bg-transparent border-0'
                onClick={() => showModal(orderState[i]._id)}
              >
                <AiFillDelete />
              </button>
            </>
          )
        });
      }

  }
  const updateOrderStatus = (a, b) => {
    dispatch(updateAOrder({ id: a, status: b }))
  }
  const deleteOrder = (e) => {
    dispatch(deleteAOrder(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getOrders(config3));
    }, 100);
  }

  /* Print */
  const printOrder = (order) => {
    const orderDetails = getOrderDetails(order); // Tạo chuỗi HTML cho đơn hàng (định dạng in)
    const popupWin = window.open('', '_blank', 'width=600,height=600');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Đơn hàng</title>
        </head>
        <body>
          ${orderDetails}
        </body>
      </html>
    `);
    popupWin.document.close();
    popupWin.print();
    popupWin.onafterprint = () => popupWin.close();
  };
  const getOrderDetails = (order) => {
    // Tạo mảng chuỗi HTML cho các hàng trong bảng
    const orderItemsHtml = order?.orderItems?.map((item) => `
          <tr key="${item._id}">
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
              ${item.product?.title}
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
              ${(item.priceAfterDiscount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
              ${item.quantity}
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
              ${(item.priceAfterDiscount * item.quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </td>
          </tr>
        `);

    // Kết hợp các chuỗi HTML để tạo thành chuỗi HTML chính
    const orderItemsHtmlString = orderItemsHtml.join('');

    // Tạo chuỗi HTML dựa trên thông tin đơn hàng
    const orderHtml = `
      <div style="max-width: 680px; margin: 0 auto; padding: 15px; border: 1px solid #ccc;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1>SMARTDEVI HOMES</h1>
        </div>
        <div>
          <i>Địa chỉ shop: Đường 3/2, phường Xuân khánh, quận Ninh Kiều, tp.Cần Thơ</i> <br />
          <i>Phone: 0919590861</i> <br />
          <i>Email: ludathoc@gmail.com</i>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div style="flex: 1;">
                <h4>Thông tin khách hàng:</h4>
                <p>Tên: ${order?.shippingInfo?.lastName} ${order?.shippingInfo?.firstName}</p>
                <p>SĐT: ${order?.shippingInfo?.mobile}</p>
                <p>Địa chỉ: ${order?.shippingInfo?.address}</p>
                <p>Email: ${order?.user?.email}</p> 
            </div>
            <div style="flex: 1;">
                <h4>Thông tin hóa đơn:</h4>
                <p>Số hóa đơn: ${order?._id}</p>
                <p>Thời gian đặt hàng:  ${new Date(order?.createdAt).toLocaleString()}</p>
                <p>Phương thức thanh toán:  ${order?.paymentMethod}</p>
            </div>
        </div>
        <table style=" border-collapse: collapse; width: 100%;">
            <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Sản phẩm</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Giá</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Số lượng</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Thành tiền</th>
            </tr>
            ${orderItemsHtmlString}
        </table>
        <div style="margin-top: 20px; text-align: right;">
            <b>Tổng cộng: ${(order?.totalPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b>
        </div>
        <div>Cảm ơn quý khách đã tin tưởng và ủng hộ. Xin cảm ơn!</div>
    </div>
    `;
    return orderHtml;
  };


  return (
    <div className='orders'>
      <h3 className='mb-3 title'>Đơn hàng</h3>
      {/* <div style={{ height: 240, width: 480 }}>
        <PieChartComponent data={orderState} /> truyen vao danh sach don hang
      </div> */}
      <div className="btn-group my-4" role="group" aria-label="Basic radio toggle button group">
        <button type="button"
          className={`btn btn-outline-primary ${selectedNavItem === null ? "active" : ""}`}
          onClick={() => setSelectedNavItem(null)}
        >
          Tất Cả
        </button>
        <button type="button"
          className={`btn btn-outline-primary ${selectedNavItem === "Đã đặt hàng" ? "active" : ""}`}
          onClick={() => setSelectedNavItem("Đã đặt hàng")}
        >
          Đã Đặt Hàng
        </button>
        <button type="button"
          className={`btn btn-outline-primary ${selectedNavItem === "Đang xử lý" ? "active" : ""}`}
          onClick={() => setSelectedNavItem("Đang xử lý")}
        >
          Đang Xử Lý
        </button>
        <button type="button"
          className={`btn btn-outline-primary ${selectedNavItem === "Đang giao" ? "active" : ""}`}
          onClick={() => setSelectedNavItem("Đang giao")}
        >
          Đang Giao</button>
        <button type="button"
          className={`btn btn-outline-primary ${selectedNavItem === "Đã nhận hàng" ? "active" : ""}`}
          onClick={() => setSelectedNavItem("Đã nhận hàng")}
        >
          Đã Nhận Hàng
        </button>
        <button type="button"
          className={`btn btn-outline-primary ${selectedNavItem === "Đã Hủy" ? "active" : ""}`}
          onClick={() => setSelectedNavItem("Đã Hủy")}
        >
          Đã Hủy
        </button>
      </div>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteOrder(orderId)}
        title="Bạn chắc chắn muốn xóa đơn hàng này?"
      />
    </div>
  )
}

export default Orders
