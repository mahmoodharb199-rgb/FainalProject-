import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";

const stripePromise = loadStripe(
  "pk_test_51Q3YRX06tWMQ8hpobthvCsTXCijdZSKOU1bmgeBDNl66bUH1VwLdu1Brax28J0zlykCKzk5BoW0C4YROcM4KJNXt00d43IWmWs"
);

const CheckoutForm = ({ orderSummary, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { updateCartCount } = useCart();
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded. Please try again.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:4000/api/payment",
        {
          paymentMethodId: paymentMethod.id,
          amount: Math.round(orderSummary.totalPrice * 100),
          deliveryInfo,
          orderSummary,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        await axios.post(
          "http://localhost:4000/api/cart/clear",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        updateCartCount(0);
        onSuccess();
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={deliveryInfo.name}
          onChange={handleChange}
          className="w-full py-2 px-3 border bg-white border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={deliveryInfo.email}
          onChange={handleChange}
          className="w-full py-2 px-3 border bg-white border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={deliveryInfo.address}
          onChange={handleChange}
          className="w-full py-2 px-3 border bg-white border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={deliveryInfo.city}
            onChange={handleChange}
            className="w-full py-2 px-3 border bg-white border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="state" className="block text-sm font-medium mb-1">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={deliveryInfo.state}
            onChange={handleChange}
            className="w-full py-2 px-3 border bg-white border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={deliveryInfo.zipCode}
            onChange={handleChange}
            className="w-full py-2 px-3 border bg-white border-gray-300 rounded-md"
            required
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="card-element"
          className="block text-sm font-medium mb-1"
        >
          Credit / Debit Card
        </label>
        <div className="border border-gray-300 rounded-md p-3">
          <CardElement />
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full  bg-green text-white py-2 rounded-md hover:bg-black disabled:bg-gray-400"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default function Payment() {
  const [orderSummary, setOrderSummary] = useState({
    totalPrice: 0,
    itemCount: 0,
    items: [],
  });
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const items = [...response.data.items, ...response.data.customItems];
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => {
        const price = item.menuItem
          ? item.menuItem.price
          : item.customFood.price;
        return sum + price * item.quantity;
      }, 0);

      setOrderSummary({
        totalPrice,
        itemCount,
        items: items.map((item) => ({
          name: item.menuItem ? item.menuItem.recipeName : item.customFood.name,
          quantity: item.quantity,
          price: item.menuItem ? item.menuItem.price : item.customFood.price,
        })),
      });

      updateCartCount(itemCount);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handlePaymentSuccess = () => {
    navigate("/");
  };

  return (
    <div className="p-4 md:p-8">
      <Navbar />

      <div className="flex flex-col md:flex-row justify-between mb-8 md:mb-12 px-4 md:px-16">
        <div className="flex-1 md:w-1/2 pr-4 mt-10 md:mt-20">
          <h3 className="text-lg md:text-xl font-semibold mb-4">
            Order Summary
          </h3>
          <div className="space-y-2">
            <p>
              <strong className="text-green">Total Price: </strong> JD 
              {orderSummary.totalPrice.toFixed(2)}
            </p>
            <p>
              <strong className="text-green">Number of Items: </strong>
              {orderSummary.itemCount}
            </p>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Items:</h4>
            <ul>
              {orderSummary.items.map((item, index) => (
                <li key={index}>
                  {item.name} - Quantity: {item.quantity} - Price: JD
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 md:w-1/2 pl-4 bg-white shadow-md rounded-md mt-10 md:mt-20">
          <h3 className="text-lg md:text-xl font-semibold mb-4 mt-6">
            Process Your Payment
          </h3>

          <Elements stripe={stripePromise}>
            <CheckoutForm
              orderSummary={orderSummary}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      </div>

      <Footer />
    </div>
  );
}
