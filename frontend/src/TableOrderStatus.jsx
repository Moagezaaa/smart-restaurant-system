import { useEffect, useState, useRef } from "react";

function TableOrderStatus({ tableNumber, order, onOrderDeleted }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const deletedRef = useRef(false);

  // Initialize timer on order prop change
  useEffect(() => {
    if (!order || !order.ended_at) {
      setTimeLeft(null);
      deletedRef.current = false;
      return;
    }
    const endedAt = new Date(order.ended_at);
    const now = new Date();
    setTimeLeft(Math.max(0, Math.floor((endedAt - now) / 1000)));
    deletedRef.current = false;
  }, [order]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return;

    // Notify parent when time runs out
    if (timeLeft <= 0 && !deletedRef.current) {
      deletedRef.current = true;
      onOrderDeleted(); // Just call the callback, let parent handle deletion
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onOrderDeleted]);

  if (!order) return <p>No active orders for Table {tableNumber}</p>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      <h3>👋 Welcome, Table {tableNumber}</h3>
      <h4>
        ⏳ Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
      </h4>
      <h5>Order Details:</h5>
      <ul>
        {order.items.map((item) => (
          <li key={item.name}>
            {item.name} x {item.quantity} (Prep time: {item.preparation_time}{" "}
            min)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TableOrderStatus;
