import React from 'react';

const DishCard = ({ item, onAddToCart }) => {
  // 1. If item is null/undefined, render nothing to avoid crashing
  if (!item) return null;

  try {
    // 2. Safely parse the price
    // This handles: null, undefined, strings, numbers, and objects
    let priceValue = 0;
    if (typeof item.price === 'object' && item.price !== null) {
      priceValue = item.price.value || 0;
    } else {
      priceValue = parseFloat(item.price) || 0;
    }

    return (
      <div className="food-card-shadow">
        <div className="card-image-wrapper">
          <img 
            src={item.imageUrl || '/placeholder-food.jpg'} 
            alt={item.name || 'Dish'} 
          />
        </div>
        <div className="card-content">
          <h3>{item.name || "Unnamed Dish"}</h3>
          <p className="description">{item.description || "No description provided."}</p>
          <div className="card-footer">
            <span className="price">₹{priceValue.toFixed(2)}</span>
            <button 
              className="add-to-cart-btn" 
              onClick={() => onAddToCart(item)}
            >
              Add +
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // 3. Instead of a white screen, log the error to the console
    console.error("DishCard Render Error! Culprit item:", item);
    return <div className="card-error">Error loading this dish.</div>;
  }
};

export default DishCard;