import React from "react";
import axios from "axios";
import "./product-card.css";

function ProductCard({ item }) {
  const { id, name, imageUrl, price } = item;

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem('token');
    if (!user) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const userId = user.id;
    let cartId;

    try {
      // Check if the cart exists for the user
      const cartResponse = await axios.get(`http://localhost:5047/api/Cart/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (cartResponse.data && cartResponse.data.id) {
        cartId = cartResponse.data.id;
      } else {
        // Create a new cart if it doesn't exist
        const newCartResponse = await axios.post(`http://localhost:5047/api/Cart`, { userId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        cartId = newCartResponse.data.id;
      }

      // Add the food item to the cart with a quantity of 1
      await axios.post(`http://localhost:5047/api/Cart/${cartId}/item`, {
        foodId: id,
        quantity: 1,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  return (
    <div className="single__product">
      <div className="product__img">
        <img src={imageUrl} alt={name} className="w-100" />
      </div>

      <div className="product__content">
        <div className="rating text-center">
          <span>
            <i className="ri-star-s-fill"></i>
          </span>
          <span>
            <i className="ri-star-s-fill"></i>
          </span>
          <span>
            <i className="ri-star-s-fill"></i>
          </span>
          <span>
            <i className="ri-star-s-fill"></i>
          </span>
          <span>
            <i className="ri-star-s-fill"></i>
          </span>
        </div>
        <h6>{name}</h6>
        <div className="d-flex align-items-center justify-content-between">
          <span className="price d-flex align-items-center">
            {" "}
            Price: $<span>{price}</span>
          </span>
          <span className="shopping__icon" onClick={addToCart}>
            <i className="ri-shopping-cart-line"></i>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;