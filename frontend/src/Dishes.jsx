// src/Dishes.jsx
import axios from "axios";

function Dishes({ dishes, loading }) {
  const isAdmin = !!localStorage.getItem("adminToken");

  if (loading) return <p>Loading...</p>;

  const handleDelete = async (name) => {
    const token = localStorage.getItem("adminToken");
    await axios.delete("http://localhost:3000/api/dishes/deleteDish", {
      headers: { Authorization: `Bearer ${token}` },
      data: { name },
    });
    window.location.reload();
  };

  return (
    <div className="row g-4">
      {dishes.map((dish) => (
        <div key={dish.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="card h-100 shadow-sm">
            {dish.image_url && (
              <img
                src={dish.image_url}
                className="card-img-top"
                alt={dish.name}
                style={{
                  height: "180px",
                  objectFit: "cover",
                }}
              />
            )}
            <div className="card-body d-flex flex-column">
              <h5 className="card-title mb-1">{dish.name}</h5>
              <p className="text-muted small mb-2">{dish.description}</p>
              <p className="fw-bold">${dish.price}</p>
              {isAdmin && (
                <button
                  className="btn btn-sm btn-danger mt-auto"
                  onClick={() => handleDelete(dish.name)}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dishes;
