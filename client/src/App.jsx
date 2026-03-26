import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeaList from './pages/TeaList';
import AIMixTea from './pages/AIMixTea';
import AIHealthPlan from './pages/AIHealthPlan';
import Profile from './pages/Profile';
import AIHistory from './pages/AIHistory';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
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
          <Route path="/ai-mix" element={<AIMixTea />} />
          <Route path="/ai-plan" element={<AIHealthPlan />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-history" element={<AIHistory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
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
