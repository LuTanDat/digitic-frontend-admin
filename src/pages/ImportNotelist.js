import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { deleteAImportNote, getImportNotes, resetState } from '../features/importNote/importNoteSlice';
import { Link } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete, AiFillPrinter } from 'react-icons/ai';
import CustomModal from '../components/CustomModal';

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Tên nhà cung cấp",
    dataIndex: "nameSupplier",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Giá",
    dataIndex: "price",
  },
  {
    title: "Ngày nhập",
    dataIndex: "date",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
  },
];

const ImportNotelist = () => {
  const [open, setOpen] = useState(false);
  const [importNoteId, setImportNoteId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setImportNoteId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getImportNotes());
  }, [])

  const importNoteState = useSelector((state) => state.importNote.importNotes);
  const data1 = [];
  for (let i = 0; i < importNoteState.length; i++) {
    data1.push({
      key: i + 1,
      nameSupplier: importNoteState[i].nameSupplier,
      brand: importNoteState[i].brand,
      quantity: importNoteState[i].quantity,
      price: importNoteState[i].price,
      date: new Date(importNoteState[i].createdAt).toLocaleString(),
      action: (
        <>
          <button
            className='me-3 fs-3 text-danger bg-transparent border-0'
            onClick={() => printOrder(importNoteState[i])}
          >
            <AiFillPrinter />
          </button>
          <Link to={`/admin/importNote/${importNoteState[i]._id}`}
            className='fs-3 text-danger'>
            <BiEdit />
          </Link>
          <button
            className='ms-3 fs-3 text-danger bg-transparent border-0'
            onClick={() => showModal(importNoteState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      )
    });
  }
  const deleteImportNote = (e) => {
    dispatch(deleteAImportNote(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getImportNotes());
    }, 100);
  }


  /* Print */
  const printOrder = (note) => {
    const noteDetails = getOrderDetails(note); // Tạo chuỗi HTML cho đơn hàng (định dạng in)
    const popupWin = window.open('', '_blank', 'width=600,height=600');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Phiếu nhập hàng</title>
        </head>
        <body>
          ${noteDetails}
        </body>
      </html>
    `);
    popupWin.document.close();
    popupWin.print();
    popupWin.onafterprint = () => popupWin.close();
  };
  const getOrderDetails = (note) => {
    // Tạo mảng chuỗi HTML cho các hàng trong bảng
    const noteItemsHtml = note?.noteItems?.map((item) => `
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
    const noteItemsHtmlString = noteItemsHtml.join('');

    // Tạo chuỗi HTML dựa trên thông tin đơn hàng
    const noteHtml = `
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
                <p>Tên: ${note?.shippingInfo?.lastName} ${note?.shippingInfo?.firstName}</p>
                <p>Địa chỉ: ${note?.shippingInfo?.address}</p>
                <p>Email: ${note?.user?.email}</p>
            </div>
            <div style="flex: 1;">
                <h4>Thông tin hóa đơn:</h4>
                <p>Số hóa đơn: ${note?._id}</p>
                <p>Thời gian đặt hàng:  ${new Date(note?.createdAt).toLocaleString()}</p>
                <p>Phương thức thanh toán:  ${note?.paymentMethod}</p>
            </div>
        </div>
        <table style=" border-collapse: collapse; width: 100%;">
            <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Sản phẩm</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Giá</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Số lượng</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Thành tiền</th>
            </tr>
            ${noteItemsHtmlString}
        </table>
        <div style="margin-top: 20px; text-align: right;">
            <b>Tổng cộng: 425,000 VND</b>
        </div>
        <div>Cảm ơn quý khách đã tin tưởng và ủng hộ. Xin cảm ơn!</div>
    </div>
    `;
    return noteHtml;
  };

  return (
    <div>
      <h3 className='mb-4 title'>Phiếu nhập</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteImportNote(importNoteId)}
        title="Bạn chắc chắn muốn xóa phiếu nhập này?"
      />
    </div>
  )
}

export default ImportNotelist
