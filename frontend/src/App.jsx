// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Login from "./Login";
import Dishes from "./Dishes";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("adminToken")),
  );

  const API_URL = "http://localhost:3000/api/dishes/getAvailableDishes";

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(API_URL);
        setDishes(response.data.data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  // Listen to storage changes (like login/logout from Login component)
  useEffect(() => {
    const onStorageChange = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("adminToken")));
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <Router>
      <div className="container py-5">
        <h1 className="mb-4 text-center">🍽️ Available Dishes</h1>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
              ) : (
                <Dishes dishes={dishes} loading={loading} />
              )
            }
          />
          <Route
            path="/admin/login"
            element={<Login onLogin={() => setIsAuthenticated(true)} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
