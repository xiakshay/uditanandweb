import './App.css';
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebFont from "webfontloader";
import React, { Fragment } from 'react';
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from './component/User/LoginSignUp';
import ProtectedRoutes from "./ProtectedRoutes";
import store from "./store";
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Payment from "./component/Cart/Payment";
import OrderSuccess from './component/Cart/OrderSuccess';
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from './component/Admin/UpdateProduct';
import OrderList from './component/Admin/OrderList.js';
import ProcessOrder from './component/Admin/ProcessOrder.js';
import UsersList from './component/Admin/UsersList.js';
import UpdateUser from './component/Admin/UpdateUser.js';
import ProductReviews from './component/Admin/ProductReviews.js';
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";

function App() {

  const { isAuthenticated, user } = useSelector(state => state.user);

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    });
    store.dispatch(loadUser());
  }, [])

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  
  return (
    <Router>
      <Fragment>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/search" element={<Search />} />
          <Route path="/password/forgot" element={<ForgotPassword />} /> ;
          <Route path="/password/reset/:token" element={<ResetPassword />} /> ;
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignUp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="/account" element={<Profile />} />
            <Route path="/me/update" element={<UpdateProfile />} />
            <Route path="/password/update" element={<UpdatePassword />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="/order/confirm" element={<ConfirmOrder />} />
            <Route path="/process/payment" element={<Payment />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/order/:id" element={<OrderDetails />} />

            <Route isAdmin={true} path="/admin/dashboard" element={<Dashboard />} />
            <Route isAdmin={true} path="/admin/products" element={<ProductList />} />
            <Route isAdmin={true} path="/admin/product" element={<NewProduct />} />
            <Route isAdmin={true} path="/admin/orders" element={<OrderList />} />
            <Route isAdmin={true} path="/admin/users" element={<UsersList />} />
            <Route isAdmin={true} path="/admin/reviews" element={<ProductReviews />} />
            
          </Route>
            <Route isAdmin={true} path="/admin/product/:id" element={<UpdateProduct />} />
            <Route isAdmin={true} path="/admin/orders/:id" element={<ProcessOrder />} />
            <Route isAdmin={true} path="/admin/users/:id" element={<UpdateUser />} />
            <Route  element={<NotFound />} />
    
        </Routes>
        <Footer />
      </Fragment>
    </Router>
  );
}

export default App;
