import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router"; // ✅ Correct import
import Login from "./Login";
import Dishes from "./Dishes";
import AdminDashboard from "./AdminDashboard";
import TableOrderStatus from "./TableOrderStatus";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function AppContent({ isAuthenticated, setIsAuthenticated, dishes, loading }) {
  const query = useQuery();
  const [tableNumber, setTableNumber] = useState(() =>
    sessionStorage.getItem("tableNumber"),
  );
  const [order, setOrder] = useState(null);

  // ✅ Get table number from URL hash if available
  useEffect(() => {
    const hash = query.get("hash");

    if (hash) {
      axios
        .get(`http://localhost:3000/table/get/${hash}`)
        .then((res) => {
          const number = res.data.tableNumber;
          sessionStorage.setItem("tableNumber", number);
          setTableNumber(number);
          window.history.replaceState({}, document.title, "/");
        })
        .catch(() => {
          sessionStorage.removeItem("tableNumber");
          setTableNumber(null);
        });
    }
  }, [query]);

  // ✅ Restore order from localStorage on load or when table changes
  useEffect(() => {
    const storedOrder = localStorage.getItem("activeOrder");
    if (storedOrder && tableNumber) {
      // ✅ Add tableNumber check
      try {
        const parsed = JSON.parse(storedOrder);
        if (parsed.tableNumber === tableNumber) {
          setOrder(parsed);
        }
      } catch (e) {
        console.error("Failed to parse stored order:", e);
        localStorage.removeItem("activeOrder");
      }
    }
  }, [tableNumber]);

  // ✅ Create new order
  const handleCreateOrder = async (selectedItems) => {
    if (!tableNumber) return;

    const totalPrice = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    try {
      const response = await axios.post(
        "http://localhost:3000/api/orders/createOrder",
        {
          table_number: tableNumber,
          total_price: totalPrice,
          items: selectedItems,
        },
      );

      const newOrder = {
        total_time: response.data.total_time,
        ended_at: response.data.ended_at,
        items: selectedItems,
        tableNumber,
      };

      // ✅ Save in state and localStorage
      setOrder(newOrder);
      localStorage.setItem("activeOrder", JSON.stringify(newOrder));
    } catch (error) {
      if (
        error.response &&
        error.response.data.error ===
          "An active order already exists for this table"
      ) {
        alert("An active order already exists for your table.");
      } else {
        alert("Failed to create order.");
      }
    }
  };

  // ✅ Handle order completion (cleanup)
  const handleOrderFinished = useCallback(async () => {
    if (!tableNumber) return;

    try {
      await axios.delete("http://localhost:3000/api/orders/deleteOrder", {
        data: { table_number: tableNumber },
      });
      setOrder(null);
      localStorage.removeItem("activeOrder");
    } catch (e) {
      console.log(e);
      alert("Failed to delete order...");
    }
  }, [tableNumber]); // Only recreate if tableNumber changes

  return (
    <div className="container py-5">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
            ) : tableNumber ? (
              order ? (
                <TableOrderStatus
                  order={order}
                  onOrderDeleted={handleOrderFinished}
                  tableNumber={tableNumber}
                />
              ) : (
                <>
                  <h1 className="mb-4 text-center">🍽️ Available Dishes</h1>
                  <Dishes
                    dishes={dishes}
                    loading={loading}
                    onCreateOrder={handleCreateOrder}
                  />
                </>
              )
            ) : (
              <>
                <h1 className="mb-4 text-center">🍽️ Available Dishes</h1>
                <Dishes
                  dishes={dishes}
                  loading={loading}
                  onCreateOrder={handleCreateOrder}
                />
              </>
            )
          }
        />
        <Route
          path="/admin/login"
          element={<Login onLogin={() => setIsAuthenticated(true)} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("adminToken")),
  );

  // ✅ Fetch dishes on load
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/dishes/getAvailableDishes",
        );
        setDishes(response.data.data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  // ✅ Listen for admin login changes across tabs
  useEffect(() => {
    const onStorageChange = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("adminToken")));
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        dishes={dishes}
        loading={loading}
      />
    </Router>
  );
}

export default App;
