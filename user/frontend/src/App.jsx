import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartProvider } from "./context/CartContext";

import Login from "./Components/Login";
import Register from "./Components/Register";
import Menu from "./Menu/Menu";
import Home from "./homepage/Home";
import Cart from "./Cart/Cart";
import Payment from "./Payment/Payment";
import Profile from "./profile/Profile";
import Contact from "./contact/Contact";
import CustomFood from "./Custom Food/CustomFood";
import Order from "./Orders/Order";
import FeedbackForm from "./Feedback/Feedback";
import MenuItemDetails from "./MenuItemDetails/MenuItemDetails";
import DriverDashboard from "./DriverDashboard/DriverDashboard";
import Orders from "./DriverDashboard/Orders";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/custom" element={<CustomFood />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Menu/Cart/payment" element={<Payment />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/menu-item/:id" element={<MenuItemDetails />} />
          {/* Driver Dashboard */}
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/driver-orders" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
