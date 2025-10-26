import { useState } from "react";
import axios from "axios";

function Dishes({ dishes, loading, onCreateOrder }) {
  const [quantities, setQuantities] = useState({});
  const isAdmin = !!localStorage.getItem("adminToken");

  if (loading) return <p>Loading...</p>;

  const handleQuantityChange = (dishName, value) => {
    const qty = Math.max(0, Math.floor(value));
    setQuantities((prev) => ({ ...prev, [dishName]: qty }));
  };

  const handleOrder = () => {
    const items = dishes
      .filter((dish) => quantities[dish.name] > 0)
      .map((dish) => ({
        name: dish.name,
        quantity: quantities[dish.name],
        preparation_time: 0.2,
        price: dish.price,
      }));

    if (items.length === 0) {
      alert("Please select at least one dish.");
      return;
    }

    // Send the selected items up to parent
    onCreateOrder(items);
  };

  const handleDelete = async (name) => {
    const token = localStorage.getItem("adminToken");
    await axios.delete("http://localhost:3000/api/dishes/deleteDish", {
      headers: { Authorization: `Bearer ${token}` },
      data: { name },
    });
    window.location.reload();
  };

  return (
    <>
      <div className="row g-4">
        {dishes.map((dish) => (
          <div key={dish.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              {dish.image_url && (
                <img
                  src={dish.image_url}
                  className="card-img-top"
                  alt={dish.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">{dish.name}</h5>
                <p className="text-muted small mb-2">{dish.description}</p>
                <p className="fw-bold">${dish.price}</p>

                {!isAdmin && (
                  <input
                    type="number"
                    min={0}
                    value={quantities[dish.name] || 0}
                    onChange={(e) =>
                      handleQuantityChange(dish.name, e.target.value)
                    }
                    placeholder="Qty"
                    className="form-control mb-2"
                  />
                )}

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

      {!isAdmin && (
        <button className="btn btn-primary mt-4" onClick={handleOrder}>
          Place Order
        </button>
      )}
    </>
  );
}

export default Dishes;
