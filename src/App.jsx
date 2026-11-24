import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import AppShell from './components/app/AppShell'
import AppHome from './pages/app/AppHome'
import AppOrders from './pages/app/AppOrders'
import AppSettings from './pages/app/AppSettings'
import About from './pages/About'
import OrderDetail from './pages/OrderDetail'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Pages that have their own header instead of the main navbar and footer

const NO_CHROME_EXACT = ['/login', '/register', '/forgot-password', '/reset-password']
const NO_CHROME_PREFIX = ['/dashboard', '/orders']

// Old links like /orders/12 still work: they land inside the app layout

function LegacyOrderRedirect() {
  const { id } = useParams()
  return <Navigate to={`/dashboard/orders/${id}`} replace />
}

function AppLayout() {
  const location = useLocation()
  const hideChrome =
    NO_CHROME_EXACT.includes(location.pathname) ||
    NO_CHROME_PREFIX.some((prefix) => location.pathname.startsWith(prefix))

  return (
    <>
      <ScrollToTop />
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Registered users only */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<AppHome />} />
          <Route path="orders" element={<AppOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="settings" element={<AppSettings />} />

          {/* pages that moved: wallet is in the top bar, discover is on Home, profile is in Settings */}

          <Route path="wallet" element={<Navigate to="/dashboard" replace />} />
          <Route path="discover" element={<Navigate to="/dashboard" replace />} />
          <Route path="profile" element={<Navigate to="/dashboard/settings" replace />} />
        </Route>
        <Route path="/orders/:id" element={<LegacyOrderRedirect />} />

        {/* The old account page now lives at /dashboard */}
        <Route path="/account" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App