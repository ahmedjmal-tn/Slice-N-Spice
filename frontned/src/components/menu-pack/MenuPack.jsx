import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import ProductCard from "../product-card/ProductCard";
import './MenuPack.css';

function MenuPack() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5047/api/Categorie", {
          headers: { Authorization: `Bearer ${token}` },
      });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Fetch products for the selected category from backend
      const fetchProducts = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No token found');

          const response = await axios.get(`http://localhost:5047/api/Categorie/${selectedCategory}/with-foods`, {
              headers: { Authorization: `Bearer ${token}` },
          });
          setProducts(response.data.foods);
      } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts();
    }
  }, [selectedCategory]);

  return (
    <section>
      <Container>
        <Row>
          <Col lg='12' className="text-center mb-4">
            <h3 className="menu__title">Our Menu Pack</h3>
          </Col>
          <Col lg='12' className="text-center mb-5">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active__btn' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </Col>
        </Row>
        <Row>
          {products.map(product => (
            <Col lg='3' md='4' sm='6' key={product.id} className="mb-4">
              <ProductCard item={product} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default MenuPack;


