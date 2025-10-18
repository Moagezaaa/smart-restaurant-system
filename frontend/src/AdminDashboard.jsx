import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard({ onLogout }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDish, setNewDish] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAllDishes();
  }, []);

  const fetchAllDishes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/dishes/getAllDishes",
        { headers },
      );
      setDishes(res.data.data);
    } catch (err) {
      console.error("Error fetching dishes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newDish.name);
      formData.append("description", newDish.description);
      formData.append("price", newDish.price);
      if (imageFile) formData.append("image", imageFile);

      await axios.post("http://localhost:3000/api/dishes/addDish", formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });

      setNewDish({ name: "", description: "", price: "" });
      setImageFile(null);
      fetchAllDishes();
    } catch (err) {
      console.error("Error adding dish:", err);
    }
  };

  const handleDelete = async (name) => {
    try {
      await axios.delete("http://localhost:3000/api/dishes/deleteDish", {
        headers,
        data: { name },
      });
      fetchAllDishes();
    } catch (err) {
      console.error("Error deleting dish:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    if (onLogout) onLogout();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Top Bar */}
      <div className="d-flex justify-content-between mb-4 align-items-center">
        <h2>👨‍🍳 Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Add Dish Form */}
      <form onSubmit={handleAdd} className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">➕ Add New Dish</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Name"
              className="form-control"
              value={newDish.name}
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Description"
              className="form-control"
              value={newDish.description}
              onChange={(e) =>
                setNewDish({ ...newDish, description: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              placeholder="Price"
              className="form-control"
              value={newDish.price}
              onChange={(e) =>
                setNewDish({ ...newDish, price: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
          <div className="col-md-1 d-grid">
            <button type="submit" className="btn btn-success w-100">
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Dishes List (same look as public page, plus delete) */}
      <ul className="list-group">
        {dishes.map((dish) => (
          <li
            key={dish.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center">
              {dish.image_url && (
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    marginRight: "15px",
                    borderRadius: "5px",
                  }}
                />
              )}
              <div>
                <strong>{dish.name}</strong> - ${dish.price}
                <div className="text-muted small">{dish.description}</div>
              </div>
            </div>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(dish.name)}
            >
              🗑️ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
