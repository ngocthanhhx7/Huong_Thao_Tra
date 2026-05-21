import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeaList from './pages/TeaList';
import TeaDetail from './pages/TeaDetail';
import AIMixTea from './pages/AIMixTea';
import AIHealthPlan from './pages/AIHealthPlan';
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
import AdminAiRecipesPage from './pages/admin/AdminAiRecipesPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminTeasPage from './pages/admin/AdminTeasPage';
import AdminIngredientsPage from './pages/admin/AdminIngredientsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import About from './pages/About';
import Contact from './pages/Contact';
import ActivatePro from './pages/ActivatePro';
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
          <Route path="/ai-mix" element={<AIMixTea />} />
          <Route path="/ai-plan" element={<AIHealthPlan />} />
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
            <Route path="ai-recipes" element={<AdminAiRecipesPage />} />
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="feedback" element={<AdminFeedbackPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="teas" element={<AdminTeasPage />} />
            <Route path="ingredients" element={<AdminIngredientsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/activate-pro" element={<ActivatePro />} />
        </Routes>
      </main>
      <ChatbotWidget />
    </div>
  );
}

export default App;
