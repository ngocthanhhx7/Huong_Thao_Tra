import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeaList from './pages/TeaList';
import TeaDetail from './pages/TeaDetail';
import AIMixTea from './pages/AIMixTea';
import Profile from './pages/Profile';
import AIHistory from './pages/AIHistory';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Checkout from './pages/Checkout';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Feedback from './pages/Feedback';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminAiRecipesPage from './pages/admin/AdminAiRecipesPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminTeasPage from './pages/admin/AdminTeasPage';
import AdminIngredientsPage from './pages/admin/AdminIngredientsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminHomeSettingsPage from './pages/admin/AdminHomeSettingsPage';
import AdminWellnessDashboard from './pages/admin/AdminWellnessDashboard';
import AdminSuspiciousUsers from './pages/admin/AdminSuspiciousUsers';
import AdminChallengesPage from './pages/admin/AdminChallengesPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Ingredients from './pages/Ingredients';
import IngredientDetail from './pages/IngredientDetail';
import NotFound from './pages/errors/NotFound';
import ServerError from './pages/errors/ServerError';
import Forbidden from './pages/errors/Forbidden';
import Unauthorized from './pages/errors/Unauthorized';
import Maintenance from './pages/errors/Maintenance';
import NetworkError from './pages/errors/NetworkError';
import Navbar from './components/Navbar';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      <Navbar />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teas" element={<TeaList />} />
          <Route path="/teas/:id" element={<TeaDetail />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/ingredients/:id" element={<IngredientDetail />} />
          <Route path="/ai-mix" element={<AIMixTea />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-history" element={<AIHistory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="ai-recipes" element={<AdminAiRecipesPage />} />
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="feedback" element={<AdminFeedbackPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="teas" element={<AdminTeasPage />} />
            <Route path="ingredients" element={<AdminIngredientsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="home-settings" element={<AdminHomeSettingsPage />} />
            <Route path="wellness" element={<AdminWellnessDashboard />} />
            <Route path="wellness/suspicious" element={<AdminSuspiciousUsers />} />
            <Route path="wellness/challenges" element={<AdminChallengesPage />} />
          </Route>

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Error pages */}
          <Route path="/401" element={<Unauthorized />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/network-error" element={<NetworkError />} />
          <Route path="/404" element={<NotFound />} />
          {/* Catch-all 404 - phải đặt cuối cùng */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <ChatbotWidget />
    </div>
  );
}

export default App;
