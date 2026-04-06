import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/user/Home';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import OrderConfirmation from './pages/user/OrderConfirmation';
import OrderHistory from './pages/user/OrderHistory';
import OrderTracking from './pages/user/OrderTracking';
import AdminDashboard from './pages/admin/Admindashboard';
import ManageFoods from './pages/admin/ManageFoods';
import ManageCategories from './pages/admin/ManageCategories';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/order-confirmation/:orderId" element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            } />

            <Route path="/my-orders" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/order-tracking/:orderId" element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            // admin routes
            <Route path="/admin/foods" element={
              <ProtectedRoute adminOnly={true}>
                <ManageFoods />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute adminOnly={true}>
                <ManageCategories />
              </ProtectedRoute>
            } />
          </Routes>
        </CartProvider>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;