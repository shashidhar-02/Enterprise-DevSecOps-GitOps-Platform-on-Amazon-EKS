import React from 'react';

const DishCard = ({ item, onAddToCart }) => {
  if (!item) return null;

  try {
    // Force price to be a valid number for .toFixed()
    const rawPrice = item.price;
    const priceValue = typeof rawPrice === 'object' 
      ? (rawPrice?.value || 0) 
      : parseFloat(rawPrice || 0);

    return (
      <div className="food-card-shadow">
        <div className="card-image-wrapper">
          <img src={item.imageUrl || '/placeholder-food.jpg'} alt={item.name || "Dish"} />
        </div>
        <div className="card-content">
          <h3>{item.name || "Unnamed Dish"}</h3>
          <p className="description">{item.description || "No description"}</p>
          <div className="card-footer">
            <span className="price">
              ₹{isNaN(priceValue) ? "0.00" : priceValue.toFixed(2)}
            </span>
            <button className="add-to-cart-btn" onClick={() => onAddToCart(item)}>
              Add +
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("DishCard render failed:", error);
    return null;
  }
};

export default DishCard;