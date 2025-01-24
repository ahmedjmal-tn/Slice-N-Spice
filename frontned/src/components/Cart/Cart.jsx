import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem('token');

  // Récupération de l'utilisateur connecté
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (user) {
      setUserId(user.id);
    }
  }, []);

  // Chargement des articles du panier
  useEffect(() => {
    if (userId) {
      const fetchCartItems = async () => {
        try {
          const response = await axios.get(`http://localhost:5047/api/Cart/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const cartItems = response.data.cartItems;

          const fetchFoodDetails = async (itemId) => {
            const foodResponse = await axios.get(`http://localhost:5047/api/Food/${itemId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return foodResponse.data;
          };

          const cartItemsWithDetails = await Promise.all(
            cartItems.map(async (item) => {
              const foodDetails = await fetchFoodDetails(item.itemId);
              return {
                ...item,
                ...foodDetails,
                cartItemId: item.id, // Assurez-vous que `cartItemId` est inclus
              };
            })
          );

          setCartItems(cartItemsWithDetails);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };

      fetchCartItems();
    }
  }, [userId, token]);

  // Suppression d'un article du panier
  const handleDelete = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5047/api/Cart/item/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.cartItemId !== cartItemId));
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  // Mise à jour de la quantité d'un article
  const handleUpdateQuantity = async (cartItemId, quantity) => {
    if (quantity < 0) {
      console.error("Quantity cannot be negative");
      return;
    }
    try {
      await axios.put(`http://localhost:5047/api/Cart/item/${cartItemId}/quantity`, quantity, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(cartItems.map((item) => (item.cartItemId === cartItemId ? { ...item, quantite: quantity } : item)));
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  // Gestion du changement de quantité dans le champ
  const handleQuantityChange = (cartItemId, value) => {
    setCartItems(cartItems.map((item) => (item.cartItemId === cartItemId ? { ...item, quantite: value } : item)));
  };

  // Calcul du total
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantite, 0).toFixed(2);
  };

  // Gestion de la commande
  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert("Votre panier est vide.");
      return;
    }
  
    const orderData = {
      id: 0, // Peut être généré côté serveur
      userId: userId, // Utilisateur connecté
      dateCreation: new Date().toISOString(), // Date actuelle au format ISO
      paymentMethod: 1, // Exemple : 1 pour "Carte de crédit" (ajustez selon vos besoins)
      orderItems: cartItems.map((item) => ({
        id: 0, // Peut être généré côté serveur
        orderId: 0, // Peut être mis à jour côté serveur
        itemId: item.itemId, // Identifiant de l'article
        quantite: item.quantite, // Quantité de l'article
        prixUnitaire: item.price, // Prix unitaire de l'article
        dateAjout: new Date().toISOString(), // Date actuelle au format ISO
      })),
    };
  
    try {
      const response = await axios.post('http://localhost:5047/api/Order', orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 201) {
        alert("Votre commande a été passée avec succès !");
        setCartItems([]); // Vide le panier après la commande
      } else {
        alert("Une erreur s'est produite lors de la commande.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Une erreur s'est produite lors de la commande.");
    }
  };

  return (
    <Fragment>
      <Header />
      <div className="cart-section">
        <div className="cart-container">
          <div className="cart-items">
            <h3 className="cart__title">Your Cart</h3>
            {cartItems.map((item) => (
              <div className="cart-item" key={item.cartItemId}>
                <div className="cart-item__img">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <div className="cart-item__content">
                  <h6>{item.name}</h6>
                  <p>Price: ${item.price}</p>
                  <div className="quantity-control">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      value={item.quantite}
                      onChange={(e) => handleQuantityChange(item.cartItemId, parseInt(e.target.value))}
                      onBlur={(e) => handleUpdateQuantity(item.cartItemId, parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                  <p>Total: ${(item.price * item.quantite).toFixed(2)}</p>
                  <button className="delete-btn" onClick={() => handleDelete(item.cartItemId)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h4>Order Summary</h4>
            <p>Total Amount: ${calculateTotal()}</p>
            <button className="order-btn" onClick={handleOrder}>
              Commander
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}

export default Cart;