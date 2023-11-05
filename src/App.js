import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Enquiries from './pages/Enquiries';
import Bloglist from './pages/Bloglist';
import Blogcatlist from './pages/Blogcatlist';
import Orders from './pages/Orders';
import Customer from './pages/Customer';
import Colorlist from './pages/Colorlist';
import Categorylist from './pages/Categorylist';
import Brandlist from './pages/Brandlist';
import Supplierlist from './pages/Supplierlist';
import ImportNotelist from './pages/ImportNotelist';
import Productlist from './pages/Productlist';
import Addblog from './pages/Addblog';
import Addblogcat from './pages/Addblogcat';
import Addcolor from './pages/Addcolor';
import Addcat from './pages/Addcat';
import Addbrand from './pages/Addbrand';
import Addsupplier from './pages/AddSupplier';
import AddimportNote from './pages/AddImportNote';
import Addproduct from './pages/Addproduct';
import Couponlist from './pages/Couponlist';
import AddCoupon from './pages/AddCoupon';
import ViewEnq from './pages/ViewEnq';
import ViewOrder from './pages/ViewOrder';
import { OpenRoutes } from './routing/OpenRoutes';
import { PrivateRoutes } from './routing/PrivateRoutes';

import { jwtDecode } from 'jwt-decode';

function App() {
  console.log(jwtDecode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmIyYTczMzNmMzk5MmYwZjNkYzY2MSIsImlhdCI6MTY5OTEwNjQyMywiZXhwIjoxNjk5MTkyODIzfQ.uKIsTjXUqsPO5-Ur6iWDxh2yBDHOUFi3AWC3r0Q2u8c"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<OpenRoutes><Login /></OpenRoutes>} />
        <Route path="/admin" element={<PrivateRoutes><MainLayout /></PrivateRoutes>}>
          <Route index element={<Dashboard />} />
          <Route path='enquiries' element={<Enquiries />} />
          <Route path='enquiries/:id' element={<ViewEnq />} />
          <Route path='blog-list' element={<Bloglist />} />
          <Route path='blog' element={<Addblog />} />
          <Route path='blog/:id' element={<Addblog />} />
          <Route path='coupon-list' element={<Couponlist />} />
          <Route path='coupon' element={<AddCoupon />} />
          <Route path='coupon/:id' element={<AddCoupon />} />
          <Route path='blog-category-list' element={<Blogcatlist />} />
          <Route path='blog-category' element={<Addblogcat />} />
          <Route path='blog-category/:id' element={<Addblogcat />} />
          <Route path='orders' element={<Orders />} />
          <Route path='order/:id' element={<ViewOrder />} />
          <Route path='customer' element={<Customer />} />
          <Route path='list-color' element={<Colorlist />} />
          <Route path='color' element={<Addcolor />} />
          <Route path='color/:id' element={<Addcolor />} />
          <Route path='list-category' element={<Categorylist />} />
          <Route path='category' element={<Addcat />} />
          <Route path='category/:id' element={<Addcat />} />
          <Route path='list-brand' element={<Brandlist />} />
          <Route path='brand' element={<Addbrand />} />
          <Route path='brand/:id' element={<Addbrand />} />
          <Route path='list-product' element={<Productlist />} />
          <Route path='product' element={<Addproduct />} />
          <Route path='product/:id' element={<Addproduct />} />
          <Route path='list-supplier' element={<Supplierlist />} />
          <Route path='supplier' element={<Addsupplier />} />
          <Route path='supplier/:id' element={<Addsupplier />} />
          <Route path='list-importNote' element={<ImportNotelist />} />
          <Route path='importNote' element={<AddimportNote />} />
          <Route path='importNote/:id' element={<AddimportNote />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
