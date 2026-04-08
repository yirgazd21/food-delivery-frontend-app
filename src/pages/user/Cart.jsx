import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, loading, updateItem, removeItem, emptyCart } = useCart();
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    setUpdating(itemId);
    await updateItem(itemId, newQuantity);
    setUpdating(null);
  };

  const handleRemoveItem = async (itemId) => {
    setUpdating(itemId);
    await removeItem(itemId);
    setUpdating(null);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await emptyCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return <div className="text-center py-20">Loading cart...</div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious food items to get started!</p>
        <Link to="/" className="btn-action inline-block">
          Browse Food
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <div key={item.cart_item_id} className="p-4 flex gap-4 items-center">
                  {/* Image */}
                  <img
                    src={item.image_url
                      ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${item.image_url}`
                      : '/placeholder.jpg'
                    }
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-rose-500 font-medium">${item.price}</p>
                  </div>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                      disabled={updating === item.cart_item_id}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                      disabled={updating === item.cart_item_id}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  {/* Item total & remove */}
                  <div className="text-right min-w-[80px]">
                    <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                    <button
                      onClick={() => handleRemoveItem(item.cart_item_id)}
                      className="text-red-500 text-sm hover:text-red-700 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clear cart button */}
          <div className="mt-4 text-right">
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 border-b pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span>Free</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 mb-6">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="btn-action w-full py-3 text-center text-orange-400 hover:text-orange-500 cursor-pointer bg-blue-200"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;