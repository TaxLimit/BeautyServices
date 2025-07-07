import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import MyRsvpsPage from "./pages/MyRsvpsPage";
import AdminPanelPage from "./pages/AdminPanelPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser({ ...JSON.parse(userData), token });
    } else if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} setUser={setUser} />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route
              path="/register"
              element={<RegisterPage setUser={setUser} />}
            />
            <Route
              path="/services/:id"
              element={<ServiceDetailsPage user={user} />}
            />
            <Route path="/my-rsvps" element={<MyRsvpsPage user={user} />} />
            <Route path="/admin" element={<AdminPanelPage user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
