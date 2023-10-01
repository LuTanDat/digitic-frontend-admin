import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import Enquiries from './pages/Enquiries';
import Bloglist from './pages/Bloglist';
import Blogcatlist from './pages/Blogcatlist';
import Orders from './pages/Orders';
import Customer from './pages/Customer';
import Colorlist from './pages/Colorlist';
import Categorylist from './pages/Categorylist';
import Brandlist from './pages/Brandlist';
import Productlist from './pages/Productlist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='enquiries' element={<Enquiries />} />
          <Route path='blog-list' element={<Bloglist />} />
          <Route path='blog-category-list' element={<Blogcatlist />} />
          <Route path='orders' element={<Orders />} />
          <Route path='customer' element={<Customer />} />
          <Route path='list-color' element={<Colorlist />} />
          <Route path='list-category' element={<Categorylist />} />
          <Route path='list-brand' element={<Brandlist />} />
          <Route path='list-product' element={<Productlist />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
