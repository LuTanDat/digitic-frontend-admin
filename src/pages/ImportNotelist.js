import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Space, Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { deleteAImportNote, getImportNotes, resetState } from '../features/importNote/importNoteSlice';
import { Link } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { AiFillDelete, AiFillPrinter } from 'react-icons/ai';
import CustomModal from '../components/CustomModal';
import { SearchOutlined } from '@ant-design/icons';


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


  // Search input of antd start
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "SNo",
      dataIndex: "key",
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "nameSupplier",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('nameSupplier'), // search
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      ...getColumnSearchProps('brand'),
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

  const data1 = [];
  for (let i = 0; i < importNoteState.length; i++) {
    data1.push({
      key: i + 1,
      nameSupplier: importNoteState[i].nameSupplier?.name,
      brand: importNoteState[i].brand,
      quantity: importNoteState[i].quantity,
      price: (importNoteState[i].price).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
      date: new Date(importNoteState[i].createdAt).toLocaleString(),
      action: (
        <>
          <button
            className='fs-4 bg-transparent border-0'
            style={{ color: "blue" }}
            onClick={() => printOrder(importNoteState[i])}
          >
            <AiFillPrinter />
          </button>
          <div className='btn-update-action'>
            <Link
              to={`/admin/importNote/${importNoteState[i]._id}`}
              className='fs-4'
              style={{ color: "rgb(47, 34, 34)" }}
            >
              <BiEdit />
            </Link>
            <button
              className='fs-4 text-danger bg-transparent border-0'
              onClick={() => showModal(importNoteState[i]._id)}
            >
              <AiFillDelete />
            </button>
          </div>
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

    // Tạo chuỗi HTML dựa trên thông tin đơn hàng
    const noteHtml = `
      <div style="max-width: 680px; margin: 0 auto; padding: 15px; border: 1px solid #ccc;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1>PHIẾU NHẬP HÀNG</h1>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div style="flex: 1;">
                <h4>Thông tin cửa hàng nhận:</h4>
                <div>
                  <p>Địa chỉ shop: </p>
                  <p>Đường 3/2, phường Xuân khánh </p>
                  <p>Quận Ninh Kiều, tp.Cần Thơ</p>
                  <p>Phone: 0919590861</p>
                  <p>Email: ludathoc@gmail.com</p>
                </div>
            </div>
            <div style="flex: 1;">
                <h4>Thông Tin Nhà Cung Cấp</h4>
                <p>Tên: ${note.nameSupplier?.name}</p>
                <p>Email:  ${note.nameSupplier?.email}</p>
                <p>Điện Thoại:  ${note.nameSupplier?.mobile}</p>
                <p>Địa Chỉ:  ${note.nameSupplier?.address}</p>
            </div>
        </div>
        <table style=" border-collapse: collapse; width: 100%;">
            <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Thương hiệu</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Số lượng</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Giá</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Ngày nhậpn</th>
            </tr>
            <tr>
                <td style="border: 1px solid #ccc; padding: 8px; text-align: center;"> ${note.brand}</td>
                <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${note.quantity}</td>
                <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${(note.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${new Date(note.createdAt).toLocaleString()}</td>
            </tr>
        </table>
        <div style="margin-top: 20px; text-align: right;">
        <b>Tổng cộng: ${(note?.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b>
        </div>
        <div>Cảm ơn Nhà cung cấp đã tin tưởng và Tạo cơ hội cùng phát triển. Xin cảm ơn!</div>
    </div>
    `;
    return noteHtml;
  };

  return (
    <div className='importNotes'>
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
