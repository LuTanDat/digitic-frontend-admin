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
    title: "Name Supplier",
    dataIndex: "nameSupplier",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Brand",
    dataIndex: "brand",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
  {
    title: "Action",
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
          <button
            className='ms-3 fs-3 text-danger bg-transparent border-0'
            onClick={() => showModal(importNoteState[i]._id)}
          >
            <AiFillPrinter />
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
  return (
    <div>
      <h3 className='mb-4 title'>ImportNotes</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteImportNote(importNoteId)}
        title="Are you sure you want to delete this importNote?"
      />
    </div>
  )
}

export default ImportNotelist
