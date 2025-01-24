import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5047/api/Account/Register", {
        email,
        password,
        nom,
        prenom,
      });
      console.log(response.data);
      // Rediriger vers la page de connexion après l'inscription
      navigate("/login");
    } catch (error) {
      console.error("Erreur d'inscription", error);
    }
  };

  return (
    
    <div className="auth-page">
      <div className="auth-container register-page">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Prenom</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">Register</button>
        </form>
        <p className="extra-links">
          Already a member? <Link to="/login">Login now</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;