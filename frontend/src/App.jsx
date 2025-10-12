import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Change this URL to match your backend IP + port
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

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">🍽️ Available Dishes</h1>

      {loading ? (
        <p>Loading dishes...</p>
      ) : dishes.length === 0 ? (
        <p>No dishes available</p>
      ) : (
        <div className="row">
          {dishes.map((dish) => (
            <div key={dish.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{dish.name}</h5>
                  <p className="card-text">{dish.description}</p>
                  <p className="card-text fw-bold">${dish.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
