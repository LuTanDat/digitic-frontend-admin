import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  // UploadOutlined,
  // UserOutlined,
  // VideoCameraOutlined,
} from '@ant-design/icons';

import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
  AiOutlineLogout,
  AiOutlineUserAdd
} from "react-icons/ai";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, Outlet } from 'react-router-dom';// noi dung thay doi theo URL cua con no
import { RiCouponLine, RiMenuAddLine } from "react-icons/ri";
import { ImBlog } from "react-icons/im";
import { IoIosNotifications } from "react-icons/io";
import { FaClipboardList, FaBloggerB } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt, BiUserPin } from "react-icons/bi";
import { CgMenuGridO } from "react-icons/cg";

import { Layout, Menu, Button, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  return (
    <Layout /*onContextMenu={(e) => e.preventDefault()}*/>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className='text-white text-center fs-5 py-3 mb-0'>
            <span className='sm-logo'>Smart</span>
            <span className='lg-logo'>SmartTech</span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['']}
          onClick={({ key }) => {
            if (key === "signout") {
              localStorage.clear();
              window.location.reload();
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: '',
              icon: <AiOutlineDashboard className='fs-4' />,
              label: 'Dashboard',
            },
            {
              key: 'customer',
              icon: <AiOutlineUser className='fs-4' />,
              label: 'Khách hàng',
            },
            {
              key: 'products',
              icon: <AiOutlineShoppingCart className='fs-4' />,
              label: 'Sản phẩm',
              children: [
                {
                  key: 'product',
                  icon: <AiOutlineUser className='fs-4' />,
                  label: 'Thêm Sản phẩm',
                },
                {
                  key: 'list-product',
                  icon: <AiOutlineUser className='fs-4' />,
                  label: 'Sản Phẩm',
                },
                {
                  key: 'brand',
                  icon: <SiBrandfolder className='fs-4' />,
                  label: 'Thêm Thương hiệu',
                },
                {
                  key: 'list-brand',
                  icon: <SiBrandfolder className='fs-4' />,
                  label: 'Thương hiệu',
                },
                {
                  key: 'category',
                  icon: <BiCategoryAlt className='fs-4' />,
                  label: 'Thêm Danh mục',
                },
                {
                  key: 'list-category',
                  icon: <BiCategoryAlt className='fs-4' />,
                  label: 'Danh mục',
                },
                {
                  key: 'color',
                  icon: <AiOutlineBgColors className='fs-4' />,
                  label: 'Thêm Màu sắc',
                },
                {
                  key: 'list-color',
                  icon: <AiOutlineBgColors className='fs-4' />,
                  label: 'Màu sắc',
                },
                {
                  key: 'coupon',
                  icon: <ImBlog className='fs-4' />,
                  label: 'Thêm Mã giảm giá',
                },
                {
                  key: 'coupon-list',
                  icon: <RiCouponLine className='fs-4' />,
                  label: 'Mã giảm giá',
                },
              ]
            },
            {
              key: 'orders',
              icon: <FaClipboardList className='fs-4' />,
              label: 'Đơn Hàng',
            },
            {
              key: 'importNotes',
              icon: <CgMenuGridO className='fs-4' />,
              label: 'Phiếu Nhập',
              children: [
                {
                  key: 'supplier',
                  icon: <AiOutlineUserAdd className='fs-4' />,
                  label: 'Thêm Nhà cung cấp',
                },
                {
                  key: 'list-supplier',
                  icon: <BiUserPin className='fs-4' />,
                  label: 'Nhà cung cấp',
                },
                {
                  key: 'importNote',
                  icon: <RiMenuAddLine className='fs-4' />,
                  label: 'Thêm Phiếu nhập',
                },
                {
                  key: 'list-importNote',
                  icon: <CgMenuGridO className='fs-4' />,
                  label: 'Phiếu nhập',
                },
              ]
            },
            {
              key: 'blogs',
              icon: <FaBloggerB className='fs-4' />,
              label: 'Bài viết',
              children: [
                {
                  key: 'blog',
                  icon: <ImBlog className='fs-4' />,
                  label: 'Thêm Bài viết',
                },
                {
                  key: 'blog-list',
                  icon: <FaBloggerB className='fs-4' />,
                  label: 'Bài viết',
                },
                {
                  key: 'blog-category',
                  icon: <ImBlog className='fs-4' />,
                  label: 'Thêm Danh mục',
                },
                {
                  key: 'blog-category-list',
                  icon: <FaBloggerB className='fs-4' />,
                  label: 'Danh mục',
                },
              ]
            },
            {
              key: 'enquiries',
              icon: <FaClipboardList className='fs-4' />,
              label: 'Thắc mắc',
            },
            {
              key: 'signout',
              icon: <AiOutlineLogout className='fs-4' />,
              label: 'Đăng Xuất',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className='d-flex justify-content-between ps-1 pe-5'
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className='d-flex gap-4 align-items-center'>
            <div className='position-relative'>
              <IoIosNotifications className='fs-4' />
              <span className='badge bg-warning rounded-circle p-1 position-absolute'>3</span>
            </div>
            <div className='d-flex gap-3 align-items-center dropdown'>
              <div>
                <img
                  width={32}
                  height={32}
                  src='https://stroyka-admin.html.themeforest.scompiler.ru/variants/ltr/images/customers/customer-4-64x64.jpg' alt=''
                />
              </div>
              <div
                role="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <h5 className='mb-0'>{currentUser.lastName + " " + currentUser.firstName}</h5>
                <p className='mb-0'>{currentUser.email}</p>
              </div>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <Link className="dropdown-item py-1 mb-1"
                    to="/"
                    style={{ "height": "auto", "lineHeight": "20px" }}
                  >
                    View Profile
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item py-1 mb-1"
                    to="/"
                    style={{ "height": "auto", "lineHeight": "20px" }}
                  >
                    SignOut
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;